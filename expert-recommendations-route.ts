/**
 * API for Expert Recommendations
 * توصيات الخبراء
 */

import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';

// GET /api/expert-recommendations - جلب توصيات الخبراء
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const expert_name = searchParams.get('expert_name');
    const ticker = searchParams.get('ticker');
    const limit = parseInt(searchParams.get('limit') || '100');

    const where: any = {};
    if (status) where.status = status.toUpperCase();
    if (expert_name) where.expert_name = { contains: expert_name };
    if (ticker) where.stock_symbol = ticker.toUpperCase();

    let recommendations = [];
    let expertStats = [];

    try {
      const dbAny = db as any;
      
      recommendations = await dbAny.expertRecommendation.findMany({
        where,
        orderBy: [{ recommendation_date: 'desc' }],
        take: limit,
      });

      // إحصائيات الخبراء
      expertStats = await dbAny.expertTrackRecord.findMany({
        orderBy: [{ success_rate: 'desc' }],
        take: 10,
      });
    } catch (dbError) {
      console.error('[Expert Recommendations] DB Error:', dbError);
      // إذا فشل الاتصال، أرجع مصفوفة فارغة
      recommendations = [];
      expertStats = [];
    }

    return NextResponse.json({
      success: true,
      recommendations,
      expertStats,
    });
  } catch (error) {
    console.error('[Expert Recommendations API] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch recommendations: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// POST /api/expert-recommendations - إضافة توصية خبير جديدة
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dbAny = db as any;

    const {
      stock_symbol,
      stock_name_ar,
      expert_name,
      expert_source,
      action,
      entry_price,
      target_price,
      stop_loss,
      recommendation_date,
      expected_duration,
      expected_duration_days,
      notes,
    } = body;

    // المتطلبات الأساسية فقط: اسم السهم والسعر
    if (!stock_symbol) {
      return NextResponse.json(
        { success: false, error: 'اسم السهم مطلوب (stock_symbol)' },
        { status: 400 }
      );
    }

    // استخدام قيم افتراضية للحقول الاختيارية
    const finalExpertName = expert_name || 'غير محدد';
    const finalAction = action || 'BUY';
    const finalEntryPrice = entry_price ? parseFloat(entry_price) : 0;
    const finalRecommendationDate = recommendation_date ? new Date(recommendation_date) : new Date();

    const recommendation = await dbAny.ExpertRecommendation.create({
      data: {
        id: randomUUID(),
        stock_symbol: stock_symbol.toUpperCase(),
        expert_name: finalExpertName,
        expert_source: expert_source || 'manual',
        action: finalAction.toUpperCase(),
        entry_price: finalEntryPrice,
        target_price: target_price ? parseFloat(target_price) : null,
        stop_loss: stop_loss ? parseFloat(stop_loss) : null,
        recommendation_date: finalRecommendationDate,
        expected_duration: expected_duration || null,
        expected_duration_days: expected_duration_days ? parseInt(expected_duration_days) : null,
        status: 'PENDING',
        notes: notes || null,
        updated_at: new Date(),
      },
    });

    // تحديث سجل الخبير
    await updateExpertTrackRecord(dbAny, finalExpertName);

    return NextResponse.json({
      success: true,
      recommendation,
      message: 'تم إضافة توصية الخبير بنجاح',
    });
  } catch (error) {
    console.error('[Expert Recommendations API] Error creating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create recommendation: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT /api/expert-recommendations - تحديث توصية (للمتابعة)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, final_price, profit_loss_percent, hit_target, hit_stop_loss, status, result_notes } = body;
    const dbAny = db as any;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing recommendation id' },
        { status: 400 }
      );
    }

    const updateData: any = {
      updated_at: new Date(),
    };

    if (final_price !== undefined) {
      updateData.final_price = parseFloat(final_price);
      updateData.verified_at = new Date();
    }
    if (profit_loss_percent !== undefined) updateData.profit_loss_percent = parseFloat(profit_loss_percent);
    if (hit_target !== undefined) updateData.hit_target = hit_target;
    if (hit_stop_loss !== undefined) updateData.hit_stop_loss = hit_stop_loss;
    if (status) updateData.status = status.toUpperCase();
    if (result_notes) updateData.result_notes = result_notes;

    const recommendation = await dbAny.ExpertRecommendation.update({
      where: { id },
      data: updateData,
    });

    // تحديث سجل الخبير
    await updateExpertTrackRecord(dbAny, recommendation.expert_name);

    return NextResponse.json({
      success: true,
      recommendation,
    });
  } catch (error) {
    console.error('[Expert Recommendations API] Error updating:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update recommendation' },
      { status: 500 }
    );
  }
}

// DELETE /api/expert-recommendations - حذف توصية
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const dbAny = db as any;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing recommendation id' },
        { status: 400 }
      );
    }

    await dbAny.ExpertRecommendation.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'تم حذف التوصية',
    });
  } catch (error) {
    console.error('[Expert Recommendations API] Error deleting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete recommendation' },
      { status: 500 }
    );
  }
}

// دالة تحديث سجل الخبير
async function updateExpertTrackRecord(dbAny: any, expertName: string) {
  try {
    // حساب إحصائيات الخبير
    const stats = await dbAny.ExpertRecommendation.aggregate({
      where: { expert_name: expertName, status: { in: ['HIT_TARGET', 'STOPPED', 'CLOSED'] } },
      _count: { id: true },
      _avg: { profit_loss_percent: true },
    });

    const successful = await dbAny.ExpertRecommendation.count({
      where: { expert_name: expertName, hit_target: true },
    });

    const total = stats._count.id || 0;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const avgReturn = stats._avg.profit_loss_percent || 0;

    // upsert سجل الخبير
    const existing = await dbAny.ExpertTrackRecord.findUnique({
      where: { expert_name: expertName },
    });

    if (existing) {
      await dbAny.ExpertTrackRecord.update({
        where: { expert_name: expertName },
        data: {
          total_recommendations: total,
          successful_recommendations: successful,
          failed_recommendations: total - successful,
          success_rate: successRate,
          avg_return: avgReturn,
          last_recommendation: new Date(),
          updated_at: new Date(),
        },
      });
    } else {
      await dbAny.ExpertTrackRecord.create({
        data: {
          id: randomUUID(),
          expert_name: expertName,
          total_recommendations: total,
          successful_recommendations: successful,
          failed_recommendations: total - successful,
          success_rate: successRate,
          avg_return: avgReturn,
          updated_at: new Date(),
        },
      });
    }
  } catch (error) {
    console.error('[Expert Track Record] Error:', error);
  }
}
