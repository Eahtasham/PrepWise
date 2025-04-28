"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Mic,
    BotIcon as Robot,
    Code,
    BarChart,
    Theater,
    Users,
    ChevronLeft,
    ChevronRight,
    Star,
    Check,
    ArrowRight,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function Home() {
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    const testimonials = [
        {
            name: "Jane Smith",
            role: "Product Manager",
            image: "/placeholder.svg?height=80&width=80",
            quote: "The interview simulations are so realistic. I felt much more confident in my actual interviews.",
        },
        {
            name: "David Chen",
            role: "Software Engineer",
            image: "/placeholder.svg?height=80&width=80",
            quote: "The AI feedback helped me identify weaknesses in my responses that I never would have noticed otherwise.",
        },
        {
            name: "Sarah Johnson",
            role: "UX Designer",
            image: "/placeholder.svg?height=80&width=80",
            quote:
                "After just two weeks of practice, I aced my interview at a top tech company. This platform is a game-changer!",
        },
    ]

    const features = [
        {
            icon: <Mic className="h-10 w-10 text-teal-500" />,
            title: "AI Speech & Sentiment Analysis",
            description: "Detects confidence level, speech clarity, and identifies filler words.",
            upcoming: true,
        },
        {
            icon: <Robot className="h-10 w-10 text-teal-500" />,
            title: "Interview Simulation",
            description: "Realistic AI-driven interviewer for different job roles and difficulty levels.",
            upcoming: false,
        },
        {
            icon: <Code className="h-10 w-10 text-teal-500" />,
            title: "In-Call Code Editor",
            description: "Live coding environment with support for popular languages for technical interviews.",
            upcoming: true,
        },
        {
            icon: <BarChart className="h-10 w-10 text-teal-500" />,
            title: "Performance Tracking & Reports",
            description: "Detailed analytics on progress over time and strengths & weaknesses analysis.",
            upcoming: false,
        },
        {
            icon: <Theater className="h-10 w-10 text-teal-500" />,
            title: "Customized Interview Scenarios",
            description: "Tailor-made interview scenarios based on your industry and experience level.",
            upcoming: false,
        },
        {
            icon: <Users className="h-10 w-10 text-teal-500" />,
            title: "Mock Panel Interviews",
            description: "Simulate panel interviews with multiple AI interviewers for a more challenging experience.",
            upcoming: false,
        },
    ]

    const plans = [
        {
            name: "Free",
            price: "$0",
            period: "forever",
            description: "Perfect for beginners",
            features: ["Basic interview simulations", "Performance tracking", "Limited question bank", "Community support"],
            buttonText: "Get Started",
            highlighted: false,
        },
        {
            name: "Premium",
            price: "$19",
            period: "per month",
            description: "For serious job seekers",
            features: [
                "All Free features",
                "AI Speech & Sentiment Analysis",
                "Code Editor",
                "Customized Interview Scenarios",
                "Mock Panel Interviews",
                "Priority support",
            ],
            buttonText: "Upgrade Now",
            highlighted: true,
        },
    ]

    const reviews = [
        {
            name: "John Doe",
            role: "Software Engineer",
            content: "This platform helped me ace my technical interviews. The AI-driven feedback was incredibly helpful!",
            avatar: "https://randomuser.me/api/portraits/men/1.jpg",
            rating: 5,
        },
        {
            name: "Jane Smith",
            role: "Product Manager",
            content: "The interview simulations are so realistic. I felt much more confident in my actual interviews.",
            avatar: "https://randomuser.me/api/portraits/women/2.jpg",
            rating: 4,
        },
        {
            name: "Mike Johnson",
            role: "Data Scientist",
            content: "The performance tracking feature helped me identify my weaknesses and improve rapidly.",
            avatar: "https://randomuser.me/api/portraits/men/3.jpg",
            rating: 5,
        },
        {
            name: "Emily Brown",
            role: "UX Designer",
            content: "I love how the platform adapts to my progress. It's like having a personal interview coach!",
            avatar: "https://randomuser.me/api/portraits/women/4.jpg",
            rating: 5,
        },
        {
            name: "Alex Lee",
            role: "Marketing Specialist",
            content: "The variety of interview scenarios is impressive. It really helped me prepare for different situations.",
            avatar: "https://randomuser.me/api/portraits/men/5.jpg",
            rating: 4,
        },
    ]

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
        },
    }

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }
    const [currentReview, setCurrentReview] = useState(0)

    return (
        <div className="min-h-screen text-white">
            {/* Navigation */}
            <header className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Link href="/" className="text-4xl font-bold text-teal-500">
                    PrepWise
                </Link>
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="#features" className="hover:text-teal-400 transition-colors">
                        Features
                    </Link>
                    <Link href="#pricing" className="hover:text-teal-400 transition-colors">
                        Pricing
                    </Link>
                    <Link href="#testimonials" className="hover:text-teal-400 transition-colors">
                        Reviews
                    </Link>
                </div>
                <div className="flex items-center space-x-4">
                    <Link href="/sign-in">
                        <Button variant="outline" className="text-white">Sign In</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-teal-500 hover:bg-teal-600 text-white">Start Free</Button>
                    </Link>

                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-14 md:py-24 flex flex-col md:flex-row items-center">
                <motion.div className="md:w-1/2 mb-10 md:mb-0" initial="hidden" animate="visible" variants={fadeIn}>
                    <h1 className="text-5xl md:text-6xl mb-24 font-bold leading-tight text-teal-400">Master Your Interviews with AI</h1>
                    <p className="mt-6 text-xl text-gray-300">Prepare, Practice, and Perfect Your Interview Skills</p>
                    <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button className="w-full sm:w-auto px-8 py-6 bg-teal-500 hover:bg-teal-600 text-white text-lg">
                                Get Started
                            </Button>
                        </motion.div>
                        <Button
                            variant="outline"
                            className="w-full sm:w-auto px-8 py-6 border-teal-500/50 text-teal-400 hover:bg-teal-500/10 text-lg"
                        >
                            See how it works
                        </Button>
                    </div>
                </motion.div>
                <motion.div className="md:w-1/2 hidden md:block" initial="hidden" animate="visible" variants={fadeIn}>
                    <Image
                        src="/robot1.png"
                        alt="AI Interview Platform"
                        width={550}
                        height={450}
                        className="rounded-lg bg-transparent shadow-2xl"
                    />
                </motion.div>
            </section>

            {/* How it Works Section */}
            <section className="container mx-auto px-4 py-16">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold">How It Works</h2>
                    <p className="mt-4 text-xl text-gray-300">Simple steps to interview success</p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {[
                        {
                            icon: <Robot className="h-12 w-12 text-teal-500" />,
                            title: "Create Your Interview",
                            description: "Create voice commanded interview for various job roles, industries, and difficulty levels.",
                        },
                        {
                            icon: <Mic className="h-12 w-12 text-teal-500" />,
                            title: "Practice with AI",
                            description: "Engage in realistic interview simulations with our AI interviewer.",
                        },
                        {
                            icon: <BarChart className="h-12 w-12 text-teal-500" />,
                            title: "Get Detailed Feedback",
                            description: "Receive personalized feedback and actionable improvement tips.",
                        },
                    ].map((step, index) => (
                        <motion.div key={index} className="bg-gray-800/50 p-8 rounded-lg text-center" variants={fadeIn}>
                            <div className="mx-auto bg-gray-700/50 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-6">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-4">{step.title}</h3>
                            <p className="text-gray-300">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold">Powerful Features to Boost Your Interview Skills</h2>
                    <p className="mt-4 text-xl text-gray-300">Unlock your potential with our cutting-edge tools</p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="bg-gray-800/50 p-6 rounded-lg relative h-full"
                            variants={fadeIn}
                            whileHover={{ y: -5 }}
                        >
                            {feature.upcoming && <Badge className="absolute top-4 right-4 bg-teal-500 hover:bg-teal-600">Upcoming</Badge>}
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                            <p className="text-gray-300">{feature.description}</p>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* Detailed Feature Sections */}
            <section className="py-20">
                <div className="container mx-auto px-4">
                    <Tabs defaultValue="code" className="w-full">
                        <TabsList className="grid w-full md:w-[400px] grid-cols-2 mx-auto mb-12">
                            <TabsTrigger value="code">Code Support</TabsTrigger>
                            <TabsTrigger value="performance">Performance</TabsTrigger>
                        </TabsList>
                        <TabsContent value="code">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                                    <h3 className="text-3xl font-bold mb-4">In-Call Code Editor</h3>
                                    <p className="text-gray-300 mb-8">
                                        Tackle technical interviews with confidence using our integrated code editor.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Live coding environment for technical interviews",
                                            "AI checks for code optimality and correctness",
                                            "Diagram & whiteboard tool for system design",
                                            "Supports multiple programming languages",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check className="h-5 w-5 text-teal-500 mr-2 mt-1" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="flex justify-center"
                                >
                                    <Image
                                        src="/code.png"
                                        alt="Code & Whiteboard Support"
                                        width={450}
                                        height={350}
                                        className="rounded-lg shadow-lg"
                                    />
                                </motion.div>
                            </div>
                        </TabsContent>
                        <TabsContent value="performance">
                            <div className="grid md:grid-cols-2 gap-8 items-center">
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="order-2 md:order-1 flex justify-center"
                                >
                                    <Image
                                        src="/feedback.png"
                                        alt="Performance Tracking & Reports"
                                        width={450}
                                        height={350}
                                        className="rounded-lg shadow-lg"
                                    />
                                </motion.div>
                                <motion.div
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    className="order-1 md:order-2"
                                >
                                    <h3 className="text-3xl font-bold mb-4">Performance Tracking & Reports</h3>
                                    <p className="text-gray-300 mb-8">
                                        Monitor your progress and identify areas for improvement with our comprehensive analytics.
                                    </p>
                                    <ul className="space-y-4">
                                        {[
                                            "Detailed analytics on progress over time",
                                            "Score comparison with industry standards",
                                            "Strengths & weaknesses analysis",
                                            "Personalized improvement recommendations",
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check className="h-5 w-5 text-teal-500 mr-2 mt-1" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">What Our Users Say</h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Don't just take our word for it - hear from our satisfied users
                        </p>
                    </motion.div>
                    <div className="relative px-12">
                        <motion.div
                            key={currentReview}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.5 }}
                            className={`max-w-4xl mx-auto p-8 rounded-2xl shadow-xl ${"dark" === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                                }`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <img
                                        src={reviews[currentReview].avatar || "/placeholder.svg"}
                                        alt={reviews[currentReview].name}
                                        className="w-24 h-24 rounded-full border-4 border-teal-500"
                                    />
                                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-teal-500 to-[#3A4750] rounded-full p-2">
                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <h3 className="text-2xl font-bold mb-1">{reviews[currentReview].name}</h3>
                                    <p className="text-teal-500 font-medium">{reviews[currentReview].role}</p>
                                </div>
                                <p className="text-lg italic mb-6">"{reviews[currentReview].content}"</p>
                                <div className="flex justify-center space-x-1">
                                    {reviews.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentReview(index)}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentReview === index
                                                    ? "w-8 bg-gradient-to-r from-teal-500 to-[#3A4750]"
                                                    : "bg-gray-300 dark:bg-gray-600"
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                        <button
                            onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:scale-110 transition-transform duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {/* <section id="testimonials" className="container mx-auto px-4 py-20">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold">What Our Users Say</h2>
                    <p className="mt-4 text-xl text-gray-300">Don't just take our word for it - hear from our satisfied users</p>
                </motion.div>

                <div className="relative max-w-3xl mx-auto">
                    <button
                        onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/50 p-2 rounded-full"
                        aria-label="Previous testimonial"
                    >
                        <ChevronLeft className="h-6 w-6" />
                    </button>

                    <motion.div
                        key={activeTestimonial}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-gray-800/50 p-8 rounded-lg text-center"
                    >
                        <div className="relative w-20 h-20 mx-auto mb-4">
                            <Image
                                src={testimonials[activeTestimonial].image || "/placeholder.svg"}
                                alt={testimonials[activeTestimonial].name}
                                fill
                                className="rounded-full object-cover"
                            />
                            <div className="absolute -bottom-2 -right-2 bg-teal-500 p-1 rounded-full">
                                <Star className="h-4 w-4 text-white" />
                            </div>
                        </div>
                        <h3 className="text-xl font-bold">{testimonials[activeTestimonial].name}</h3>
                        <p className="text-teal-400">{testimonials[activeTestimonial].role}</p>
                        <p className="mt-6 italic text-gray-300">"{testimonials[activeTestimonial].quote}"</p>

                        <div className="flex justify-center mt-8 space-x-2">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTestimonial(index)}
                                    className={`h-2 rounded-full transition-all ${index === activeTestimonial ? "w-8 bg-teal-500" : "w-2 bg-gray-600"
                                        }`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>
                    </motion.div>

                    <button
                        onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-800/50 p-2 rounded-full"
                        aria-label="Next testimonial"
                    >
                        <ChevronRight className="h-6 w-6" />
                    </button>
                </div>
            </section> */}

            {/* Pricing Section */}
            <section id="pricing" className="py-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold">Simple, Transparent Pricing</h2>
                        <p className="mt-4 text-xl text-gray-300">Choose the plan that works for you</p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={index}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-100px" }}
                                variants={fadeIn}
                                whileHover={{ y: -10 }}
                                className={`rounded-lg overflow-hidden ${plan.highlighted
                                    ? "border-2 border-teal-500 bg-gray-800/70 shadow-lg shadow-teal-500/20"
                                    : "border border-gray-700 bg-gray-800/50"
                                    }`}
                            >
                                <div className="p-8">
                                    <h3 className="text-2xl font-bold">{plan.name}</h3>
                                    <div className="mt-4 flex items-baseline">
                                        <span className="text-4xl font-extrabold">{plan.price}</span>
                                        <span className="ml-2 text-gray-400">/{plan.period}</span>
                                    </div>
                                    <p className="mt-2 text-gray-400">{plan.description}</p>

                                    <ul className="mt-8 space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-start">
                                                <Check className="h-5 w-5 text-teal-500 mr-2 mt-1" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8">
                                        <Button
                                            className={`w-full py-6 ${plan.highlighted
                                                ? "bg-teal-500 hover:bg-teal-600 text-white"
                                                : "bg-gray-700 hover:bg-gray-600 text-white"
                                                }`}
                                        >
                                            {plan.buttonText}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeIn}
                >
                    <h2 className="text-4xl font-bold">Get confident, get hired — start your interview prep today!</h2>
                    <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
                        Join thousands of job seekers who have improved their interview skills and landed their dream jobs.
                    </p>
                    <motion.div className="mt-10" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button className="px-8 py-6 bg-teal-500 hover:bg-teal-600 text-white text-lg">
                            Start Your Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </motion.div>
                </motion.div>
            </section>

            <footer className="pt-10 pb-6 px-8 bg-gray-900 w-full">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-6 md:mb-0">
                            <Link href="/" className="text-2xl font-bold text-teal-500">
                                PrepWise
                            </Link>
                            <p className="mt-2 text-gray-400">Your AI-powered interview coach</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8">
                            <div>
                                <h4 className="font-semibold mb-3">Product</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Features
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Pricing
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Testimonials
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Company</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            About
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Blog
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Careers
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-3">Support</h4>
                                <ul className="space-y-2 text-gray-400">
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Help Center
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Contact
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href="#" className="hover:text-teal-400">
                                            Privacy
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
                        <p>© {new Date().getFullYear()} PrepWise. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
