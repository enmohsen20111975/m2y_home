'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import {
  Check,
  Crown,
  Sparkles,
  Star,
  Zap,
  Brain,
  TrendingUp,
  Eye,
  BarChart3,
  Bell,
  Headphones,
  Rocket,
  Shield,
  Infinity,
  Gift,
  Clock,
  ChevronLeft,
  Building2,
  Users,
  Phone,
  Mail,
  MessageCircle,
  Loader2,
  CreditCard,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/lib/store';

// ==================== HARDCODED PLANS ====================

interface PlanFeature {
  icon: React.ReactNode;
  text: string;
  highlighted?: boolean;
}

interface Plan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  price: number;
  priceYearly: number;
  originalPrice?: number;
  popular?: boolean;
  premium?: boolean;
  cta: string;
  features: PlanFeature[];
  limits: {
    watchlist: number | string;
    portfolio: number | string;
    alerts: number | string;
    aiAnalysis: boolean;
    deepAnalysis: boolean;
    prioritySupport: boolean;
    advancedReports: boolean;
    apiAccess: boolean;
  };
}

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    nameAr: 'الأساسية',
    description: 'للمستثمر المبتدئ',
    price: 0,
    priceYearly: 0,
    cta: 'ابدأ مجاناً',
    features: [
      { icon: <Eye className="w-4 h-4" />, text: 'قائمة مراقبة حتى 5 أسهم' },
      { icon: <Building2 className="w-4 h-4" />, text: 'محفظة استثمارية واحدة' },
      { icon: <Bell className="w-4 h-4" />, text: '3 تنبيهات أسعار' },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'تحليلات أساسية' },
      { icon: <Shield className="w-4 h-4" />, text: 'بيانات محمية' },
    ],
    limits: {
      watchlist: 5,
      portfolio: 1,
      alerts: 3,
      aiAnalysis: false,
      deepAnalysis: false,
      prioritySupport: false,
      advancedReports: false,
      apiAccess: false,
    },
  },
  {
    id: 'normal',
    name: 'Normal',
    nameAr: 'الاحترافية',
    description: 'للمستثمر الجاد',
    price: 99,
    priceYearly: 990,
    originalPrice: 199,
    popular: true,
    cta: 'ابدأ الآن',
    features: [
      { icon: <Eye className="w-4 h-4" />, text: 'قائمة مراقبة حتى 25 سهم' },
      { icon: <Building2 className="w-4 h-4" />, text: '5 محافظ استثمارية' },
      { icon: <Bell className="w-4 h-4" />, text: '15 تنبيه أسعار' },
      { icon: <Brain className="w-4 h-4" />, text: 'تحليل بالذكاء الاصطناعي', highlighted: true },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'تقارير متقدمة' },
      { icon: <TrendingUp className="w-4 h-4" />, text: 'توصيات ذكية' },
      { icon: <Shield className="w-4 h-4" />, text: 'دعم بالبريد الإلكتروني' },
    ],
    limits: {
      watchlist: 25,
      portfolio: 5,
      alerts: 15,
      aiAnalysis: true,
      deepAnalysis: false,
      prioritySupport: false,
      advancedReports: true,
      apiAccess: false,
    },
  },
  {
    id: 'premium',
    name: 'Premium',
    nameAr: 'المتقدمة',
    description: 'للمستثمر المحترف',
    price: 299,
    priceYearly: 2990,
    originalPrice: 399,
    premium: true,
    cta: 'تواصل معنا',
    features: [
      { icon: <Infinity className="w-4 h-4" />, text: 'قائمة مراقبة غير محدودة' },
      { icon: <Infinity className="w-4 h-4" />, text: 'محافظ استثمارية غير محدودة' },
      { icon: <Infinity className="w-4 h-4" />, text: 'تنبيهات غير محدودة' },
      { icon: <Brain className="w-4 h-4" />, text: 'تحليل عميق بالذكاء الاصطناعي', highlighted: true },
      { icon: <BarChart3 className="w-4 h-4" />, text: 'تقارير حصرية ومتقدمة' },
      { icon: <Users className="w-4 h-4" />, text: 'وصول مبكر للميزات' },
      { icon: <Headphones className="w-4 h-4" />, text: 'دعم أولوي 24/7' },
      { icon: <Zap className="w-4 h-4" />, text: 'وصول API' },
    ],
    limits: {
      watchlist: '∞',
      portfolio: '∞',
      alerts: '∞',
      aiAnalysis: true,
      deepAnalysis: true,
      prioritySupport: true,
      advancedReports: true,
      apiAccess: true,
    },
  },
];

// ==================== COMPONENT ====================

export function SubscriptionView() {
  const { data: session, status } = useSession();
  const { user, setCurrentView } = useAppStore();
  const searchParams = useSearchParams();
  const isLoggedIn = !!user || status === 'authenticated';
  
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);

  // Handle payment callback
  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    if (paymentStatus === 'success') {
      toast.success('تم الدفع بنجاح! تم تفعيل اشتراكك.');
      setCurrentView('dashboard');
    } else if (paymentStatus === 'failed') {
      toast.error('فشلت عملية الدفع. يرجى المحاولة مرة أخرى.');
    }
  }, [searchParams, setCurrentView]);

  const handleStartFreeTrial = async () => {
    if (!isLoggedIn) {
      setCurrentView('auth');
      return;
    }

    try {
      setLoading('free-trial');
      
      // Activate free plan directly (no payment gateway)
      const response = await fetch('/api/subscription/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'free',
          payment_gateway: 'free',
          billing_period: 'monthly',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('تم تفعيل الباقة المجانية بنجاح!');
        setCurrentView('dashboard');
      } else {
        toast.error(data.error || 'فشل تفعيل الباقة المجانية');
      }
    } catch (error) {
      console.error('Free trial error:', error);
      toast.error('حدث خطأ في تفعيل الباقة المجانية');
    } finally {
      setLoading(null);
    }
  };

  const handlePaidSubscription = async (plan: Plan) => {
    if (!isLoggedIn) {
      setCurrentView('auth');
      return;
    }

    try {
      setLoading(plan.id);
      // Redirect to our API endpoint which will generate token and redirect to m2y.net
      window.location.href = `/api/subscribe/${plan.id}?type=card&billingPeriod=${billingPeriod}`;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('حدث خطأ في إنشاء عملية الدفع');
    } finally {
      setLoading(null);
    }
  };

  const handlePlanSelect = (plan: Plan) => {
    if (!isLoggedIn) {
      setCurrentView('auth');
      return;
    }
    
    if (plan.id === 'free') {
      toast.success('يمكنك البدء بالباقة المجانية الآن!');
      setCurrentView('dashboard');
    } else if (plan.id === 'premium') {
      setSelectedPlan(plan);
      setShowContactModal(true);
    } else {
      // For Pro plan - show payment options
      setSelectedPlan(plan);
      setShowPaymentOptions(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-emerald-950/20" dir="rtl">
      {/* Special Offer Banner */}
      <div className="bg-gradient-to-l from-emerald-600 via-teal-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center md:text-right">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 animate-pulse" />
              <span className="font-bold text-lg">عرض خاص!</span>
            </div>
            <span className="text-emerald-50">
              الموقع مجاني بالكامل لمدة شهر مع جميع الميزات الاحترافية
            </span>
            <div className="flex items-center gap-1 bg-white/20 rounded-full px-3 py-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">عرض محدود</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
        
        <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-8">
          <div className="text-center">
            {/* Logo Badge */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-2xl shadow-emerald-500/30">
              <Crown className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              اختر باقتك المناسبة
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              استثمر بذكاء مع خطط اشتراك مرنة تناسب احتياجاتك. ابدأ مجاناً وترقّى في أي وقت.
            </p>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-emerald-500" />
                <span>بيانات محمية 100%</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-emerald-500" />
                <span>إلغاء في أي وقت</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Headphones className="w-4 h-4 text-emerald-500" />
                <span>دعم فني متميز</span>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-3 bg-muted/50 rounded-full p-1.5">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                  billingPeriod === 'yearly'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                سنوي
                <Badge className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.5">
                  وفّر 17%
                </Badge>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              onSelect={() => handlePlanSelect(plan)}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">مقارنة الباقات</h2>
          <ComparisonTable plans={plans} billingPeriod={billingPeriod} />
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
        <div className="space-y-4">
          <FAQItem
            question="هل يمكنني تغيير الباقة لاحقاً؟"
            answer="نعم، يمكنك الترقية أو تخفيض باقتك في أي وقت من إعدادات الحساب. في حالة الترقية، سيتم احتساب الفرق فقط."
          />
          <FAQItem
            question="ما هي طرق الدفع المتاحة؟"
            answer="نقبل بطاقات فيزا وماستركارد، فوري، فودافون كاش، ومحافظ إلكترونية أخرى. جميع المعاملات مشفرة وآمنة."
          />
          <FAQItem
            question="هل هناك فترة تجريبية؟"
            answer="نعم! حالياً نقدم الموقع مجاناً بالكامل لمدة شهر مع جميع الميزات. سجل الآن واستفد من هذا العرض المحدود."
          />
          <FAQItem
            question="هل يمكنني إلغاء الاشتراك؟"
            answer="بالتأكيد، يمكنك إلغاء اشتراكك في أي وقت من إعدادات الحساب. ستحتفظ بالوصول حتى نهاية الفترة المدفوعة."
          />
        </div>
      </div>

      {/* Payment Options Modal */}
      {showPaymentOptions && selectedPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mb-4">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">اختر طريقة الاشتراك</CardTitle>
              <CardDescription>
                باقة {selectedPlan.nameAr} - {billingPeriod === 'yearly' ? `${selectedPlan.priceYearly} ج.م/سنة` : `${selectedPlan.price} ج.م/شهر`}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* InstaPay Quick Payment */}
              <div className="p-4 rounded-lg border-2 border-purple-500/50 bg-gradient-to-l from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-bold text-lg">دفع سريع بـ InstaPay</span>
                    <p className="text-xs text-muted-foreground">تحويل فوري - تفعيل فوري</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  ادفع عبر InstaPay وسيتم تفعيل اشتراكك خلال دقائق!
                </p>
                <Button
                  className="w-full bg-gradient-to-l from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  onClick={() => {
                    window.open('https://ipn.eg/S/enmohsen20111975qnb/instapay/36uC2o', '_blank');
                    toast.info('بعد الدفع، تواصل معنا لتأكيد الاشتراك');
                  }}
                >
                  <Wallet className="w-4 h-4 ml-2" />
                  ادفع عبر InstaPay
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              {/* Free Trial Option */}
              <div className="p-4 rounded-lg border-2 border-emerald-500/50 bg-emerald-50 dark:bg-emerald-900/20">
                <div className="flex items-center gap-3 mb-2">
                  <Gift className="w-6 h-6 text-emerald-600" />
                  <span className="font-bold text-lg">الفترة التجريبية المجانية</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  استمتع بجميع الميزات الاحترافية مجاناً لمدة شهر كامل!
                </p>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleStartFreeTrial}
                  disabled={loading === 'free-trial'}
                >
                  {loading === 'free-trial' ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4 ml-2" />
                  )}
                  {loading === 'free-trial' ? 'جاري التفعيل...' : 'ابدأ مجاناً لمدة شهر'}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">أو</span>
                </div>
              </div>

              {/* Paid Subscription Option */}
              <div className="p-4 rounded-lg border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-6 h-6 text-foreground" />
                  <span className="font-bold text-lg">اشتراك مدفوع</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  ادفع الآن واستمتع بالاشتراك الفوري مع ضمان استمرارية الخدمة.
                </p>
                <Button
                  className="w-full bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  onClick={() => handlePaidSubscription(selectedPlan)}
                  disabled={loading === selectedPlan.id}
                >
                  {loading === selectedPlan.id ? (
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4 ml-2" />
                  )}
                  {loading === selectedPlan.id ? 'جاري التحميل...' : `ادفع ${billingPeriod === 'yearly' ? selectedPlan.priceYearly : selectedPlan.price} ج.م`}
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowPaymentOptions(false)}
              >
                إلغاء
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-4">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">تواصل معنا</CardTitle>
              <CardDescription>
                للاشتراك في الباقة المتقدمة، تواصل مع فريقنا
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
                  <p className="font-medium">support@glminvestment.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">الهاتف</p>
                  <p className="font-medium" dir="ltr">+20 100 123 4567</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="text-sm text-muted-foreground">واتساب</p>
                  <p className="font-medium" dir="ltr">+20 100 123 4567</p>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowContactModal(false)}
                >
                  إغلاق
                </Button>
                <Button
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => {
                    window.open('mailto:support@glminvestment.com', '_blank');
                  }}
                >
                  <Mail className="w-4 h-4 ml-2" />
                  أرسل بريد
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// ==================== PLAN CARD COMPONENT ====================

function PlanCard({ 
  plan, 
  billingPeriod, 
  onSelect,
  loading,
}: { 
  plan: Plan; 
  billingPeriod: 'monthly' | 'yearly';
  onSelect: () => void;
  loading: string | null;
}) {
  const displayPrice = billingPeriod === 'yearly' ? plan.priceYearly : plan.price;
  const monthlyPrice = billingPeriod === 'yearly' ? Math.round(plan.priceYearly / 12) : plan.price;
  const savings = billingPeriod === 'yearly' && plan.price > 0 
    ? (plan.price * 12) - plan.priceYearly 
    : 0;
  const isLoading = loading === plan.id;

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
        plan.popular 
          ? 'border-2 border-emerald-500 dark:border-emerald-600 shadow-xl shadow-emerald-500/10' 
          : plan.premium
          ? 'border-2 border-amber-500 dark:border-amber-600 shadow-xl shadow-amber-500/10'
          : 'border border-border hover:border-emerald-500/50'
      }`}
    >
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-px left-0 right-0">
          <div className="bg-gradient-to-l from-emerald-500 to-teal-600 text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            الأكثر شعبية
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {plan.premium && (
        <div className="absolute -top-px left-0 right-0">
          <div className="bg-gradient-to-l from-amber-500 to-orange-600 text-white text-center py-2 text-sm font-semibold flex items-center justify-center gap-2">
            <Crown className="w-4 h-4" />
            الأفضل للمحترفين
          </div>
        </div>
      )}

      <CardHeader className={`text-center ${plan.popular || plan.premium ? 'pt-14' : 'pt-6'}`}>
        {/* Icon */}
        <div
          className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${
            plan.premium
              ? 'bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30'
              : plan.popular
              ? 'bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30'
              : 'bg-muted'
          }`}
        >
          {plan.premium ? (
            <Crown className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          ) : plan.popular ? (
            <Star className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Zap className="w-7 h-7 text-muted-foreground" />
          )}
        </div>

        {/* Plan Name */}
        <CardTitle className="text-2xl mb-1">{plan.nameAr}</CardTitle>
        <CardDescription className="text-sm">{plan.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Price */}
        <div className="text-center">
          {plan.price === 0 ? (
            <div className="flex items-center justify-center gap-2">
              <span className="text-4xl font-bold">مجاني</span>
              <Badge className="bg-emerald-500 text-white">للأبد</Badge>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2 mb-1">
                {plan.originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    {plan.originalPrice}
                  </span>
                )}
                <span className="text-4xl font-bold" dir="ltr">
                  {displayPrice}
                </span>
                <span className="text-muted-foreground">ج.م</span>
              </div>
              {billingPeriod === 'yearly' && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground" dir="ltr">
                    {monthlyPrice} ج.م / شهر
                  </p>
                  <Badge className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border-0">
                    توفير {savings} ج.م سنوياً
                  </Badge>
                </div>
              )}
              {billingPeriod === 'monthly' && (
                <p className="text-sm text-muted-foreground">شهرياً</p>
              )}
            </>
          )}
        </div>

        <Separator />

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature, idx) => (
            <li
              key={idx}
              className={`flex items-center gap-3 text-sm ${
                feature.highlighted ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''
              }`}
            >
              <span className={`flex-shrink-0 ${feature.highlighted ? 'text-emerald-500' : 'text-emerald-500'}`}>
                {feature.icon}
              </span>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>

        <Separator />

        {/* CTA Button */}
        <Button
          className={`w-full py-6 text-base font-semibold ${
            plan.popular
              ? 'bg-gradient-to-l from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-500/25'
              : plan.premium
              ? 'bg-gradient-to-l from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-500/25'
              : 'bg-foreground text-background hover:bg-foreground/90'
          }`}
          onClick={onSelect}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 ml-2 animate-spin" />
          ) : (
            <>
              {plan.price === 0 && <Rocket className="w-5 h-5 ml-2" />}
              {plan.popular && <Zap className="w-5 h-5 ml-2" />}
              {plan.premium && <Crown className="w-5 h-5 ml-2" />}
            </>
          )}
          {isLoading ? 'جاري التحميل...' : plan.cta}
        </Button>

        {/* Trial Note */}
        {plan.price > 0 && (
          <p className="text-xs text-center text-muted-foreground">
            بدون التزام · إلغاء في أي وقت
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== COMPARISON TABLE ====================

function ComparisonTable({ plans, billingPeriod }: { plans: Plan[]; billingPeriod: 'monthly' | 'yearly' }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right py-4 px-4 font-semibold">الميزة</th>
                {plans.map((p) => (
                  <th
                    key={p.id}
                    className={`text-center py-4 px-4 font-semibold ${
                      p.popular ? 'text-emerald-600 dark:text-emerald-400' : ''
                    }`}
                  >
                    {p.nameAr}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <ComparisonRow label="السعر الشهري" plans={plans} getValue={(p) => 
                p.price === 0 ? 'مجاني' : `${p.price} ج.م`
              } />
              <ComparisonRow label="السعر السنوي" plans={plans} getValue={(p) => 
                p.priceYearly === 0 ? 'مجاني' : `${p.priceYearly} ج.م`
              } />
              <ComparisonRow label="قائمة المراقبة" plans={plans} getValue={(p) => 
                typeof p.limits.watchlist === 'string' ? 'غير محدود' : `${p.limits.watchlist} سهم`
              } highlight />
              <ComparisonRow label="المحافظ الاستثمارية" plans={plans} getValue={(p) => 
                typeof p.limits.portfolio === 'string' ? 'غير محدود' : `${p.limits.portfolio} محفظة`
              } />
              <ComparisonRow label="تنبيهات الأسعار" plans={plans} getValue={(p) => 
                typeof p.limits.alerts === 'string' ? 'غير محدود' : `${p.limits.alerts} تنبيه`
              } />
              <ComparisonRow 
                label="تحليل بالذكاء الاصطناعي" 
                plans={plans} 
                getValue={(p) => p.limits.aiAnalysis} 
                isBoolean 
              />
              <ComparisonRow 
                label="تحليل عميق متقدم" 
                plans={plans} 
                getValue={(p) => p.limits.deepAnalysis} 
                isBoolean 
              />
              <ComparisonRow 
                label="تقارير متقدمة" 
                plans={plans} 
                getValue={(p) => p.limits.advancedReports} 
                isBoolean 
              />
              <ComparisonRow 
                label="دعم أولوي" 
                plans={plans} 
                getValue={(p) => p.limits.prioritySupport} 
                isBoolean 
              />
              <ComparisonRow 
                label="وصول API" 
                plans={plans} 
                getValue={(p) => p.limits.apiAccess} 
                isBoolean 
              />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonRow({ 
  label, 
  plans, 
  getValue, 
  isBoolean = false,
  highlight = false,
}: { 
  label: string; 
  plans: Plan[]; 
  getValue: (p: Plan) => string | number | boolean;
  isBoolean?: boolean;
  highlight?: boolean;
}) {
  return (
    <tr className={`border-b last:border-0 ${highlight ? 'bg-muted/30' : ''}`}>
      <td className="py-3 px-4 font-medium">{label}</td>
      {plans.map((p) => {
        const value = getValue(p);
        return (
          <td key={p.id} className="text-center py-3 px-4">
            {isBoolean ? (
              value ? (
                <Check className="w-5 h-5 text-emerald-500 mx-auto" />
              ) : (
                <span className="w-5 h-5 text-muted-foreground/30 mx-auto block">—</span>
              )
            ) : (
              <span className={highlight ? 'font-semibold' : ''}>{value}</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}

// ==================== FAQ ITEM ====================

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-right hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold">{question}</span>
        <ChevronLeft className={`w-5 h-5 text-muted-foreground transition-transform ${isOpen ? '-rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-muted-foreground">
          {answer}
        </div>
      )}
    </Card>
  );
}
