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
    const dbAny = db as any;
    
    let recommendations = [];
    try {
      recommendations = await dbAny.expertRecommendation.findMany({
        orderBy: { recommendation_date: 'desc' },
        take: 100,
      });
    } catch (dbError) {
      console.error('[GET /api/admin/recommendations] DB Error:', dbError);
      recommendations = [];
    }

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
    const dbAny = db as any;
    
    const {
      stock_symbol,
      expert_name,
      action,
      entry_price,
      target_price,
      stop_loss,
      recommendation_date,
      notes,
    } = body;

    // المتطلبات الأساسية فقط: اسم السهم
    if (!stock_symbol) {
      return NextResponse.json(
        { success: false, error: 'اسم السهم مطلوب' },
        { status: 400 }
      );
    }

    const { randomUUID } = await import('crypto');
    
    const recommendation = await dbAny.expertRecommendation.create({
      data: {
        id: randomUUID(),
        stock_symbol: stock_symbol.toUpperCase(),
        expert_name: expert_name || 'غير محدد',
        expert_source: 'admin',
        action: (action || 'BUY').toUpperCase(),
        entry_price: entry_price ? parseFloat(entry_price) : 0,
        target_price: target_price ? parseFloat(target_price) : null,
        stop_loss: stop_loss ? parseFloat(stop_loss) : null,
        recommendation_date: recommendation_date ? new Date(recommendation_date) : new Date(),
        status: 'PENDING',
        notes: notes || null,
        updated_at: new Date(),
      },
    });

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
