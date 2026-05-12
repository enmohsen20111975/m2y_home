/**
 * API for Expert Recommendations
 * توصيات الخبراء
 */

import { NextRequest, NextResponse } from 'next/server';
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

    const recommendations = await db.expertRecommendation.findMany({
      where,
      orderBy: [{ recommendation_date: 'desc' }],
      take: limit,
    });

    // إحصائيات الخبراء
    const expertStats = await db.expertTrackRecord.findMany({
      orderBy: [{ success_rate: 'desc' }],
      take: 10,
    });

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

    // المتطلبات الأساسية فقط: اسم السهم
    if (!stock_symbol) {
      return NextResponse.json(
        { success: false, error: 'اسم السهم مطلوب (stock_symbol)' },
        { status: 400 }
      );
    }

    const recommendation = await db.expertRecommendation.create({
      data: {
        stock_symbol: stock_symbol.toUpperCase(),
        stock_name_ar: stock_name_ar || null,
        expert_name: expert_name || 'غير محدد',
        expert_source: expert_source || 'manual',
        action: (action || 'BUY').toUpperCase(),
        entry_price: entry_price ? parseFloat(entry_price) : null,
        target_price: target_price ? parseFloat(target_price) : null,
        stop_loss: stop_loss ? parseFloat(stop_loss) : null,
        recommendation_date: recommendation_date ? new Date(recommendation_date) : new Date(),
        expected_duration: expected_duration || null,
        expected_duration_days: expected_duration_days ? parseInt(expected_duration_days) : null,
        status: 'PENDING',
        notes: notes || null,
      },
    });

    // تحديث سجل الخبير
    await updateExpertTrackRecord(expert_name || 'غير محدد');

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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing recommendation id' },
        { status: 400 }
      );
    }

    const updateData: any = {};

    if (final_price !== undefined) {
      updateData.final_price = parseFloat(final_price);
      updateData.verified_at = new Date();
    }
    if (profit_loss_percent !== undefined) updateData.profit_loss_percent = parseFloat(profit_loss_percent);
    if (hit_target !== undefined) updateData.hit_target = hit_target;
    if (hit_stop_loss !== undefined) updateData.hit_stop_loss = hit_stop_loss;
    if (status) updateData.status = status.toUpperCase();
    if (result_notes) updateData.result_notes = result_notes;

    const recommendation = await db.expertRecommendation.update({
      where: { id },
      data: updateData,
    });

    // تحديث سجل الخبير
    await updateExpertTrackRecord(recommendation.expert_name);

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

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing recommendation id' },
        { status: 400 }
      );
    }

    await db.expertRecommendation.delete({
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
async function updateExpertTrackRecord(expertName: string) {
  try {
    // حساب إحصائيات الخبير
    const stats = await db.expertRecommendation.aggregate({
      where: { expert_name: expertName, status: { in: ['HIT_TARGET', 'STOPPED', 'CLOSED'] } },
      _count: { id: true },
      _avg: { profit_loss_percent: true },
    });

    const successful = await db.expertRecommendation.count({
      where: { expert_name: expertName, hit_target: true },
    });

    const total = stats._count.id || 0;
    const successRate = total > 0 ? (successful / total) * 100 : 0;
    const avgReturn = stats._avg.profit_loss_percent || 0;

    // upsert سجل الخبير
    const existing = await db.expertTrackRecord.findUnique({
      where: { expert_name: expertName },
    });

    if (existing) {
      await db.expertTrackRecord.update({
        where: { expert_name: expertName },
        data: {
          total_recommendations: total,
          successful_recommendations: successful,
          failed_recommendations: total - successful,
          success_rate: successRate,
          avg_return: avgReturn,
          last_recommendation: new Date(),
        },
      });
    } else {
      await db.expertTrackRecord.create({
        data: {
          expert_name: expertName,
          total_recommendations: total,
          successful_recommendations: successful,
          failed_recommendations: total - successful,
          success_rate: successRate,
          avg_return: avgReturn,
        },
      });
    }
  } catch (error) {
    console.error('[Expert Track Record] Error:', error);
  }
}
