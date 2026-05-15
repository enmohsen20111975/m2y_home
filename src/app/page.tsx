'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  TrendingUp,
  BarChart3,
  LineChart,
  Coins,
  DollarSign,
  Globe,
  Shield,
  Users,
  Brain,
  Target,
  Briefcase,
  Eye,
  CheckCircle2,
  Star,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  ArrowUp,
  Zap,
  Award,
  Lock,
  FileText,
  Scale,
  Heart,
  Facebook,
  Twitter,
  Youtube,
  Instagram,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet'
import { useTheme } from 'next-themes'

/* ─── helpers ─── */

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

function FadeIn({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function SectionHeading({ title, subtitle, id }: { title: string; subtitle: string; id?: string }) {
  return (
    <FadeIn className="text-center mb-12">
      <div id={id} className="scroll-mt-20" />
      <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">{subtitle}</p>
    </FadeIn>
  )
}

/* ─── NAV LINKS ─── */

const NAV_LINKS = [
  { label: 'الرئيسية', href: 'hero' },
  { label: 'الأسهم', href: 'stocks' },
  { label: 'الذهب', href: 'gold' },
  { label: 'العملات', href: 'currency' },
  { label: 'التوصيات', href: 'expert-recommendations' },
  { label: 'تحليل AI', href: 'ai-analysis' },
  { label: 'المحفظة', href: 'portfolio' },
  { label: 'الباقات', href: 'pricing' },
  { label: 'تواصل', href: 'contact' },
]

/* ─── HEADER ─── */

function Header() {
  const { setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => scrollToId('hero')} className="flex items-center gap-2 font-bold text-xl text-primary">
            <TrendingUp className="w-7 h-7" />
            <span>GLM Investment</span>
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => scrollToId(l.href)}
                className="px-3 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                const isDark = document.documentElement.classList.contains('dark')
                setTheme(isDark ? 'light' : 'dark')
              }}
              aria-label="تبديل المظهر"
              className="relative"
            >
              <Sun className="w-5 h-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute w-5 h-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => scrollToId('contact')}>
              تسجيل الدخول
            </Button>
            <Button className="hidden sm:inline-flex" onClick={() => scrollToId('pricing')}>
              ابدأ مجاناً
            </Button>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <div className="flex flex-col gap-2 mt-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-lg text-primary flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" /> GLM Investment
                    </span>
                  </div>
                  <Separator className="mb-2" />
                  {NAV_LINKS.map((l) => (
                    <SheetClose key={l.href} asChild>
                      <button
                        onClick={() => scrollToId(l.href)}
                        className="text-right px-3 py-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
                      >
                        {l.label}
                      </button>
                    </SheetClose>
                  ))}
                  <Separator className="my-2" />
                  <Button variant="outline" className="w-full">تسجيل الدخول</Button>
                  <Button className="w-full" onClick={() => scrollToId('pricing')}>ابدأ مجاناً</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─── HERO ─── */

function HeroSection() {
  const stats = [
    { value: '+458', label: 'سهم' },
    { value: '+10', label: 'خبراء' },
    { value: '+1000', label: 'مستخدم' },
  ]

  return (
    <section id="hero" className="relative overflow-hidden scroll-mt-16">
      {/* BG Gradient */}
      <div className="absolute inset-0 bg-gradient-to-bl from-emerald-600/10 via-teal-500/5 to-transparent dark:from-emerald-600/20 dark:via-teal-500/10" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <FadeIn>
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5">
              🚀 منصة الاستثمار الذكية في البورصة المصرية
            </Badge>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              استثمر بذكاء في
              <span className="text-primary"> البورصة المصرية</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              تحليل مدعوم بالذكاء الاصطناعي، توصيات خبراء موثوقين، وتتبع فوري للأسهم والذهب والعملات — كل ذلك في منصة واحدة
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" className="text-lg px-8" onClick={() => scrollToId('pricing')}>
                ابدأ مجاناً
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToId('stocks')}>
                تعرف على المزيد
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary">{s.value}</div>
                  <div className="text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─── STOCKS ─── */

function StocksSection() {
  const features = [
    {
      icon: <LineChart className="w-8 h-8" />,
      title: 'أسعار مباشرة',
      desc: 'تتبع أسعار الأسهم في البورصة المصرية لحظياً مع تحديثات فورية أثناء جلسات التداول',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'رسوم بيانية متقدمة',
      desc: 'شاشات بيانية احترافية مع مؤشرات فنية قابلة للتخصيص لتحليل حركة الأسعار',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'تحليل فني شامل',
      desc: 'مؤشرات فنية متقدمة مثل RSI و MACD و Bollinger Bands لاتخاذ قرارات استثمارية مدروسة',
    },
  ]

  return (
    <section id="stocks" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="تتبع الأسهم المصرية"
          subtitle="تابع أسعار أسهم البورصة المصرية (EGX) مع تحليلات فنية متقدمة وأدوات استثمارية احترافية"
        />

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.3} className="mt-10">
          <Card className="bg-gradient-to-l from-emerald-600/5 to-teal-600/5 border-primary/20">
            <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold mb-1">مؤشر EGX30</h3>
                <p className="text-muted-foreground">تابع أداء المؤشر الرئيسي للبورصة المصرية مع تحليلات يومية</p>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold text-2xl">
                <TrendingUp className="w-6 h-6" />
                <span>27,450</span>
                <Badge className="bg-emerald-600 text-white">+1.8%</Badge>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── GOLD ─── */

function GoldSection() {
  const prices = [
    { karat: '24 قيراط', price: '3,850 ج.م', change: '+0.5%', up: true },
    { karat: '21 قيراط', price: '3,370 ج.م', change: '+0.4%', up: true },
    { karat: '18 قيراط', price: '2,890 ج.م', change: '+0.3%', up: true },
  ]

  const features = [
    {
      icon: <Coins className="w-8 h-8" />,
      title: 'أسعار الذهب الفورية',
      desc: 'أسعار الذهب عيار 24 و 21 و 18 بالجنيه المصري مع تحديثات مستمرة',
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: 'سجل تاريخي للأسعار',
      desc: 'تتبع حركة أسعار الذهب على مدار الفترات الزمنية المختلفة مع رسوم بيانية تفاعلية',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: 'الفضة والمعادن الثمينة',
      desc: 'أسعار الفضة والبلاتين والبالاديوم مع مقارنة الأداء التاريخي',
    },
  ]

  return (
    <section id="gold" className="scroll-mt-16 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="الذهب والمعادن الثمينة"
          subtitle="تابع أسعار الذهب والفضة في مصر لحظياً مع سجل تاريخي شامل للأسعار"
        />

        {/* Price Cards */}
        <FadeIn className="mb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {prices.map((p) => (
              <Card key={p.karat} className="text-center hover:shadow-lg transition-shadow border-yellow-500/20">
                <CardHeader className="pb-2">
                  <CardDescription className="text-sm">{p.karat}</CardDescription>
                  <CardTitle className="text-2xl">{p.price}</CardTitle>
                </CardHeader>
                <CardFooter className="justify-center">
                  <Badge variant={p.up ? 'default' : 'destructive'} className={p.up ? 'bg-emerald-600 text-white' : ''}>
                    {p.change}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-yellow-500/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-600 dark:text-yellow-400 mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CURRENCY ─── */

function CurrencySection() {
  const rates = [
    { currency: 'الدولار الأمريكي', code: 'USD', rate: '50.75 ج.م', change: '+0.2%', up: true },
    { currency: 'اليورو', code: 'EUR', rate: '54.30 ج.م', change: '-0.1%', up: false },
    { currency: 'الجنيه الإسترليني', code: 'GBP', rate: '63.80 ج.م', change: '+0.3%', up: true },
    { currency: 'الريال السعودي', code: 'SAR', rate: '13.53 ج.م', change: '+0.2%', up: true },
  ]

  const features = [
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'أسعار الصرف الفورية',
      desc: 'تتبع أسعار العملات الرئيسية مقابل الجنيه المصري مع تحديثات مستمرة',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: 'أسعار البنك المركزي',
      desc: 'أسعار الصرف الرسمية من البنك المركزي المصري محدثة يومياً',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'مقارنة البنوك',
      desc: 'قارن أسعار الصرف بين البنوك المصرية المختلفة للحصول على أفضل سعر',
    },
  ]

  return (
    <section id="currency" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="سوق العملات"
          subtitle="تابع أسعار الصرف مقابل الجنيه المصري مع أسعار البنك المركزي والمقارنة بين البنوك"
        />

        <FadeIn className="mb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {rates.map((r) => (
              <Card key={r.code} className="hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{r.code}</CardTitle>
                    <Badge variant={r.up ? 'default' : 'destructive'} className={r.up ? 'bg-emerald-600 text-white' : ''}>
                      {r.change}
                    </Badge>
                  </div>
                  <CardDescription>{r.currency}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{r.rate}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── EXPERT RECOMMENDATIONS ─── */

function ExpertRecommendationsSection() {
  const experts = [
    { name: 'أحمد محمد', role: 'محلل فني', success: '87%', recommendations: 234 },
    { name: 'سارة علي', role: 'محلل أساسي', success: '91%', recommendations: 189 },
    { name: 'محمد حسن', role: 'مدير محافظ', success: '84%', recommendations: 312 },
  ]

  const features = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'سجل الخبراء',
      desc: 'تابع سجل أداء الخبراء ونسبة نجاح توصياتهم قبل الاشتراك',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'توصيات محددة',
      desc: 'توصيات واضحة بأسعار الدخول والخروج ووقف الخسارة لكل صفقة',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'مجتمع المستثمرين',
      desc: 'تواصل مع خبراء ومستثمرين آخرين وشارك في النقاشات والتحليلات',
    },
  ]

  return (
    <section id="expert-recommendations" className="scroll-mt-16 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="توصيات الخبراء"
          subtitle="احصل على توصيات استثمارية موثوقة من خبراء معتمدين بسجل أداء موثق"
        />

        <FadeIn className="mb-10">
          <div className="grid sm:grid-cols-3 gap-4">
            {experts.map((e) => (
              <Card key={e.name} className="hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-2 text-2xl font-bold">
                    {e.name.charAt(0)}
                  </div>
                  <CardTitle className="text-lg">{e.name}</CardTitle>
                  <CardDescription>{e.role}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="flex justify-center gap-6">
                    <div>
                      <div className="text-2xl font-bold text-emerald-600">{e.success}</div>
                      <div className="text-xs text-muted-foreground">نسبة النجاح</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{e.recommendations}</div>
                      <div className="text-xs text-muted-foreground">توصية</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── AI ANALYSIS ─── */

function AIAnalysisSection() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'تحليل ذكي بال AI',
      desc: 'تحليل آلي للأسهم باستخدام نماذج الذكاء الاصطناعي مع تقييم شامل لفرص الاستثمار',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'مؤشرات فنية متقدمة',
      desc: 'RSI, MACD, Bollinger Bands, Moving Averages وأكثر من 20 مؤشر فني قابل للتخصيص',
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'توقعات ذكية',
      desc: 'توقعات مبنية على تحليل البيانات التاريخية والأنماط السعرية مع تقييم مستوى الثقة',
    },
  ]

  const indicators = [
    { name: 'RSI', desc: 'مؤشر القوة النسبية', value: '65', signal: 'شراء' },
    { name: 'MACD', desc: 'تقارب وتباعد المتوسطات', value: '↑', signal: 'إيجابي' },
    { name: 'BB', desc: 'نطاقات بولينجر', value: 'وسط', signal: 'محايد' },
  ]

  return (
    <section id="ai-analysis" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="تحليل الذكاء الاصطناعي"
          subtitle='استفد من قوة الذكاء الاصطناعي في تحليل الأسهم واتخاذ قرارات استثمارية أذكى'
        />

        <FadeIn className="mb-10">
          <Card className="bg-gradient-to-l from-emerald-600/5 to-teal-600/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                مؤشرات فنية لحظية
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {indicators.map((ind) => (
                  <div key={ind.name} className="flex items-center justify-between p-3 rounded-lg bg-background/80">
                    <div>
                      <div className="font-bold">{ind.name}</div>
                      <div className="text-xs text-muted-foreground">{ind.desc}</div>
                    </div>
                    <Badge className={ind.signal === 'شراء' || ind.signal === 'إيجابي' ? 'bg-emerald-600 text-white' : ''}>
                      {ind.signal}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PORTFOLIO ─── */

function PortfolioSection() {
  const features = [
    {
      icon: <Briefcase className="w-8 h-8" />,
      title: 'إدارة المحفظة',
      desc: 'أنشئ وأدر محفظتك الاستثمارية مع تتبع الأرباح والخسائر تلقائياً',
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'قائمة المراقبة',
      desc: 'أضف الأسهم التي تتابعها إلى قائمة المراقبة مع تنبيهات الأسعار',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'تقارير الأداء',
      desc: 'تقارير مفصلة عن أداء محفظتك مع مقارنة مع المؤشرات الرئيسية',
    },
  ]

  return (
    <section id="portfolio" className="scroll-mt-16 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="إدارة المحفظة الاستثمارية"
          subtitle="أدر استثماراتك بسهولة مع تتبع شامل للأرباح والخسائر وأداء المحفظة"
        />

        <FadeIn className="mb-10">
          <Card className="bg-gradient-to-l from-emerald-600/5 to-teal-600/5 border-primary/20">
            <CardContent className="p-6">
              <div className="grid sm:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-emerald-600">+12.5%</div>
                  <div className="text-sm text-muted-foreground mt-1">إجمالي العائد</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">15</div>
                  <div className="text-sm text-muted-foreground mt-1">سهم في المحفظة</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-emerald-600">+8,450 ج.م</div>
                  <div className="text-sm text-muted-foreground mt-1">صافي الربح</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <FadeIn key={f.title} delay={i * 0.1}>
              <Card className="h-full hover:shadow-lg transition-shadow border-primary/10">
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    {f.icon}
                  </div>
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{f.desc}</p>
                </CardContent>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── PRICING ─── */

function PricingSection() {
  const [yearly, setYearly] = useState(false)

  const plans = [
    {
      name: 'مجاني',
      price: 0,
      desc: 'ابدأ مجاناً واستكشف المنصة',
      features: [
        'تتبع حتى 5 أسهم',
        'أسعار الذهب والعملات',
        'تحليل أساسي محدود',
        'قائمة مراقبة واحدة',
      ],
      cta: 'ابدأ مجاناً',
      popular: false,
    },
    {
      name: 'الاحترافية',
      price: yearly ? 990 : 99,
      period: yearly ? 'سنوياً' : 'شهرياً',
      desc: 'للمستثمرين الجادين',
      features: [
        'تتبع أسهم غير محدود',
        'توصيات الخبراء',
        'تحليل AI متقدم',
        'محفظة استثمارية',
        'تنبيهات أسعار مخصصة',
        'تقارير أداء مفصلة',
      ],
      cta: 'اشترك الآن',
      popular: true,
    },
    {
      name: 'المتقدمة',
      price: yearly ? 2990 : 299,
      period: yearly ? 'سنوياً' : 'شهرياً',
      desc: 'للمحترفين والمؤسسات',
      features: [
        'كل مزايا الاحترافية',
        'توصيات حصرية VIP',
        'تحليل AI متعمق',
        'وصول مبكر للميزات',
        'دعم أولوية 24/7',
        'تقارير مخصصة',
        'API للمطورين',
      ],
      cta: 'اشترك الآن',
      popular: false,
    },
  ]

  return (
    <section id="pricing" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="باقات الاشتراك"
          subtitle="اختر الباقة المناسبة لاحتياجاتك الاستثمارية — ابدأ مجاناً وطوّر خطتك"
        />

        <FadeIn className="flex justify-center mb-10">
          <div className="flex items-center gap-3 bg-background rounded-full p-1 border">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                !yearly ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              شهري
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                yearly ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }`}
            >
              سنوي
              <Badge className="mr-2 bg-emerald-600 text-white text-[10px] px-1.5">وفّر 17%</Badge>
            </button>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((p, i) => (
            <FadeIn key={p.name} delay={i * 0.1}>
              <Card
                className={`h-full flex flex-col relative ${
                  p.popular
                    ? 'border-2 border-primary shadow-lg scale-[1.02]'
                    : 'border-primary/10'
                }`}
              >
                {p.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4">
                    الأكثر شعبية
                  </Badge>
                )}
                <CardHeader className="text-center pt-8">
                  <CardTitle className="text-2xl">{p.name}</CardTitle>
                  <CardDescription>{p.desc}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-extrabold">{p.price}</span>
                    <span className="text-muted-foreground"> ج.م{p.period ? `/${p.period}` : ''}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-sm">{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={p.popular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {p.cta}
                  </Button>
                </CardFooter>
              </Card>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */

function FAQSection() {
  const faqs = [
    {
      q: 'كيف أبدأ في استخدام منصة GLM Investment؟',
      a: 'يمكنك التسجيل مجاناً خلال ثوانٍ معدودة. بعد التسجيل ستحصل على وصول فوري لتتبع الأسهم والذهب والعملات مع إمكانية الترقية للباقات المدفوعة لاحقاً.',
    },
    {
      q: 'هل التوصيات الاستثمارية موثوقة؟',
      a: 'نعم، جميع خبرائنا معتمدون بسجل أداء موثق وشفاف. يمكنك الاطلاع على نسبة نجاح كل خبير وتاريخ توصياته قبل الاشتراك.',
    },
    {
      q: 'ما الفرق بين الباقة المجانية والاحترافية؟',
      a: 'الباقة المجانية تتيح تتبع 5 أسهم وأسعار الذهب والعملات. الباقة الاحترافية توفر تتبع غير محدود، توصيات خبراء، تحليل AI متقدم، وإدارة محفظة استثمارية كاملة.',
    },
    {
      q: 'هل يمكنني إلغاء الاشتراك في أي وقت؟',
      a: 'بالتأكيد! يمكنك إلغاء اشتراكك في أي وقت بدون أي رسوم إضافية. ستظل قادراً على استخدام المنصة حتى نهاية فترة الاشتراك المدفوعة.',
    },
    {
      q: 'كيف يعمل تحليل الذكاء الاصطناعي؟',
      a: 'نماذج الذكاء الاصطناعي لدينا تحلل البيانات التاريخية والأنماط السعرية ومؤشرات السوق لتقديم توقعات وتحليلات فورية. النظام يتعلم باستمرار من بيانات السوق لتحسين دقته.',
    },
    {
      q: 'هل بياناتي المالية آمنة؟',
      a: 'نعم، نستخدم أحدث تقنيات التشفير وحماية البيانات. لا نخزن بيانات بنكية حساسة وجميع المعاملات مشفرة بتقنية SSL. نلتزم بمعايير الأمان العالمية.',
    },
  ]

  return (
    <section id="faq" className="scroll-mt-16 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="الأسئلة الشائعة"
          subtitle="إجابات على أكثر الأسئلة شيوعاً حول منصة GLM Investment"
        />

        <FadeIn>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-right text-base font-medium">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── ABOUT ─── */

function AboutSection() {
  return (
    <section id="about" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="من نحن"
          subtitle="تعرّف على GLM Investment ورؤيتنا لمستقبل الاستثمار في مصر"
        />

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <FadeIn>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold">رؤيتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                نسعى لتقديم أدوات استثمارية احترافية متاحة للجميع في المنطقة العربية. نؤمن بأن كل مستثمر يستحق الوصول إلى تحليلات متقدمة وتوصيات موثوقة تساعده في اتخاذ قرارات مالية أفضل.
              </p>
              <h3 className="text-2xl font-bold">مهمتنا</h3>
              <p className="text-muted-foreground leading-relaxed">
                تمكين المستثمرين المصريين من خلال تقديم منصة متكاملة تجمع بين الذكاء الاصطناعي وخبرة المحللين المحترفين، مع شفافية كاملة في الأداء والتوصيات.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <Shield className="w-6 h-6" />, value: 'موثوقية', label: 'بيانات موثوقة ومحدثة' },
                { icon: <Lock className="w-6 h-6" />, value: 'أمان', label: 'حماية بيانات المستخدمين' },
                { icon: <Star className="w-6 h-6" />, value: 'جودة', label: 'تحليلات عالية الدقة' },
                { icon: <Heart className="w-6 h-6" />, value: 'شفافية', label: 'سجل أداء واضح' },
              ].map((item) => (
                <Card key={item.value} className="text-center p-6 hover:shadow-lg transition-shadow border-primary/10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-3">
                    {item.icon}
                  </div>
                  <div className="font-bold mb-1">{item.value}</div>
                  <div className="text-xs text-muted-foreground">{item.label}</div>
                </Card>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─── CONTACT ─── */

function ContactSection() {
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="contact" className="scroll-mt-16 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="تواصل معنا"
          subtitle="نسعد بتواصلك معنا لأي استفسار أو اقتراح"
        />

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <FadeIn>
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>أرسل لنا رسالة</CardTitle>
                <CardDescription>سنرد عليك في أقرب وقت ممكن</CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">تم إرسال رسالتك بنجاح!</h3>
                    <p className="text-muted-foreground">سنتواصل معك قريباً</p>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setSubmitted(true)
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">الاسم</label>
                      <Input placeholder="أدخل اسمك" required />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">البريد الإلكتروني</label>
                      <Input type="email" placeholder="example@email.com" required dir="ltr" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">الرسالة</label>
                      <Textarea placeholder="اكتب رسالتك هنا..." rows={4} required />
                    </div>
                    <Button type="submit" className="w-full" size="lg">
                      إرسال الرسالة
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </FadeIn>

          {/* Info */}
          <FadeIn delay={0.2}>
            <div className="space-y-6">
              <Card className="border-primary/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">البريد الإلكتروني</h3>
                    <p className="text-muted-foreground text-sm" dir="ltr">support@glminvestment.com</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">الهاتف</h3>
                    <p className="text-muted-foreground text-sm" dir="ltr">+20 100 123 4567</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 shrink-0">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">واتساب</h3>
                    <p className="text-muted-foreground text-sm">تواصل معنا عبر واتساب للدعم السريع</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      <MessageCircle className="w-4 h-4 ml-1" />
                      فتح واتساب
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10">
                <CardContent className="p-6 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">العنوان</h3>
                    <p className="text-muted-foreground text-sm">القاهرة، مصر</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  )
}

/* ─── TERMS ─── */

function TermsSection() {
  return (
    <section id="terms" className="scroll-mt-16 py-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-6 text-center">شروط الاستخدام</h2>
          <Card className="border-primary/10">
            <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                باستخدامك لمنصة GLM Investment فإنك توافق على الشروط والأحكام التالية. يرجى قراءتها بعناية قبل استخدام المنصة.
              </p>
              <h3 className="text-foreground font-bold text-lg">1. الاستخدام المسموح</h3>
              <p>
                يُسمح باستخدام المنصة للأغراض الشخصية وغير التجارية فقط. لا يجوز نسخ أو إعادة توزيع المحتوى دون إذن مسبق.
              </p>
              <h3 className="text-foreground font-bold text-lg">2. إخلاء المسؤولية</h3>
              <p>
                المعلومات والتوصيات المقدمة على المنصة لأغراض تعليمية ومعلوماتية فقط ولا تُعد نصيحة مالية. القرارات الاستثمارية هي مسؤوليتك الشخصية بالكامل.
              </p>
              <h3 className="text-foreground font-bold text-lg">3. الاشتراكات والمدفوعات</h3>
              <p>
                يتم تجديد الاشتراكات تلقائياً ما لم يتم إلغاؤها قبل تاريخ التجديد. رسوم الاشتراك غير قابلة للاسترداد بعد بدء فترة الاشتراك.
              </p>
              <h3 className="text-foreground font-bold text-lg">4. خصوصية البيانات</h3>
              <p>
                نلتزم بحماية بياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا. لا نشارك بياناتك مع أطراف ثالثة دون موافقتك.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── PRIVACY ─── */

function PrivacySection() {
  return (
    <section id="privacy" className="scroll-mt-16 py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <h2 className="text-3xl font-bold mb-6 text-center">سياسة الخصوصية</h2>
          <Card className="border-primary/10">
            <CardContent className="p-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                نحن في GLM Investment نأخذ خصوصيتك على محمل الجد. تساعدك سياسة الخصوصية هذه على فهم كيفية جمع واستخدام وحماية بياناتك الشخصية.
              </p>
              <h3 className="text-foreground font-bold text-lg">1. البيانات التي نجمعها</h3>
              <p>
                نجمع البيانات الضرورية لتقديم الخدمة مثل: الاسم، البريد الإلكتروني، بيانات الاستخدام. لا نجمع بيانات بنكية حساسة.
              </p>
              <h3 className="text-foreground font-bold text-lg">2. كيف نستخدم بياناتك</h3>
              <p>
                نستخدم بياناتك لتحسين تجربتك على المنصة، تقديم المحتوى المخصص، والتواصل معك بخصوص حسابك واشتراكاتك.
              </p>
              <h3 className="text-foreground font-bold text-lg">3. حماية البيانات</h3>
              <p>
                نستخدم أحدث تقنيات التشفير (SSL/TLS) لحماية بياناتك أثناء النقل والتخزين. نتبع معايير أمان عالمية لمنع الوصول غير المصرح به.
              </p>
              <h3 className="text-foreground font-bold text-lg">4. حقوقك</h3>
              <p>
                لديك الحق في الوصول إلى بياناتك، تصحيحها، أو حذفها في أي وقت. يمكنك أيضاً الاعتراض على معالجة بياناتك الشخصية.
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── FOOTER ─── */

function Footer() {
  const quickLinks = [
    { label: 'الرئيسية', href: 'hero' },
    { label: 'الأسهم', href: 'stocks' },
    { label: 'الأسعار', href: 'gold' },
    { label: 'العملات', href: 'currency' },
    { label: 'التوصيات', href: 'expert-recommendations' },
    { label: 'تحليل AI', href: 'ai-analysis' },
    { label: 'المحفظة', href: 'portfolio' },
    { label: 'الباقات', href: 'pricing' },
    { label: 'من نحن', href: 'about' },
    { label: 'تواصل', href: 'contact' },
  ]

  const legalLinks = [
    { label: 'شروط الاستخدام', href: 'terms' },
    { label: 'سياسة الخصوصية', href: 'privacy' },
  ]

  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-bold text-xl text-primary mb-4">
              <TrendingUp className="w-6 h-6" />
              GLM Investment
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">
              منصة الاستثمار الذكية في البورصة المصرية. تحليلات متقدمة، توصيات موثوقة، وأدوات احترافية.
            </p>
            <div className="flex gap-3">
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="فيسبوك">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="تويتر">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="يوتيوب">
                <Youtube className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9" aria-label="انستجرام">
                <Instagram className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2">
            <h3 className="font-bold mb-4">روابط سريعة</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {quickLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollToId(l.href)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors text-right py-1"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legal + Contact */}
          <div>
            <h3 className="font-bold mb-4">قانوني</h3>
            <div className="space-y-2 mb-6">
              {legalLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => scrollToId(l.href)}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <h3 className="font-bold mb-3">تواصل معنا</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2" dir="ltr">
                <Mail className="w-4 h-4" />
                support@glminvestment.com
              </p>
              <p className="flex items-center gap-2" dir="ltr">
                <Phone className="w-4 h-4" />
                +20 100 123 4567
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} GLM Investment. جميع الحقوق محفوظة.</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
            العودة للأعلى
          </button>
        </div>
      </div>
    </footer>
  )
}

/* ─── MAIN PAGE ─── */

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StocksSection />
        <GoldSection />
        <CurrencySection />
        <ExpertRecommendationsSection />
        <AIAnalysisSection />
        <PortfolioSection />
        <PricingSection />
        <FAQSection />
        <AboutSection />
        <ContactSection />
        <TermsSection />
        <PrivacySection />
      </main>
      <Footer />
    </div>
  )
}
