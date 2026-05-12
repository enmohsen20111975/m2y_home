import { NextRequest, NextResponse } from 'next/server';
import { requireAdminRequest } from '@/lib/admin-auth';
import { db } from '@/lib/db';

// ---------------------------------------------------------------------------
// GET /api/admin/recommendations
// Get all expert recommendations (admin only)
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // Verify admin access
  const authError = requireAdminRequest(request);
  if (authError) return authError;

  try {
    const recommendations = await db.expertRecommendation.findMany({
      orderBy: { recommendation_date: 'desc' },
      take: 100,
    });

    return NextResponse.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('[GET /api/admin/recommendations] Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء جلب التوصيات: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/recommendations
// Add a new expert recommendation (admin only)
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest) {
  const authError = requireAdminRequest(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    
    const {
      stock_symbol,
      stock_name_ar,
      expert_name,
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
        { success: false, error: 'اسم السهم مطلوب' },
        { status: 400 }
      );
    }

    const recommendation = await db.expertRecommendation.create({
      data: {
        stock_symbol: stock_symbol.toUpperCase(),
        stock_name_ar: stock_name_ar || null,
        expert_name: expert_name || 'غير محدد',
        expert_source: 'admin',
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
      message: 'تم إضافة التوصية بنجاح',
    });
  } catch (error) {
    console.error('[POST /api/admin/recommendations] Error:', error);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء إضافة التوصية: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Helper: Update expert track record
// ---------------------------------------------------------------------------
async function updateExpertTrackRecord(expertName: string) {
  try {
    // حساب إحصائيات الخبير
    const stats = await db.expertRecommendation.aggregate({
      where: { 
        expert_name: expertName, 
        status: { in: ['HIT_TARGET', 'STOPPED', 'CLOSED'] } 
      },
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
