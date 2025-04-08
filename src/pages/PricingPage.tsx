import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { pricingPlans, faqData } from "@/data/constants";

const PricingPage = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-cyan-50 section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="heading-1 text-gray-900">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-gray-600">
              Choose the plan that's right for your healthcare facility
            </p>

            {/* Billing Toggle */}
            <div className="pt-6 pb-4">
              <div className="inline-flex items-center bg-gray-100 p-1 rounded-full">
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    isAnnual
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Annual Billing
                  <span className="ml-1.5 text-xs font-normal text-green-600">
                    Save 20%
                  </span>
                </button>
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    !isAnnual
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  Monthly Billing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding -mt-20">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`glass-card rounded-xl p-8 border ${
                  plan.popular
                    ? "border-primary shadow-lg relative"
                    : "border-gray-100 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-gray-600">/month</span>
                  {isAnnual && (
                    <p className="text-sm text-gray-500 mt-1">
                      Billed annually
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link to="/contact" className="block">
                  <Button
                    variant={plan.popular ? "default" : "outline"}
                    className={`w-full btn-hover ${
                      plan.popular ? "" : "border-gray-300"
                    }`}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Find answers to common questions about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqData.map((faq, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 md:p-12 text-white text-center">
            <h2 className="heading-2 mb-4">
              Ready to transform patient feedback?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
              Start your 14-day free trial today. No credit card required.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/login/admin">
                <Button
                  size="lg"
                  variant="secondary"
                  className="btn-hover rounded-full px-6 bg-white text-primary hover:bg-gray-100"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link to="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="btn-hover rounded-full px-6 border-white text-white hover:bg-white/10"
                >
                  Request Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
