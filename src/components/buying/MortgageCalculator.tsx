"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "../ScrollReveal";

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-CA").format(value);
}

function parseNumericInput(value: string): number {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

// Input component matching the site's form styling
function CalcInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="text-white/70 text-[12px] md:text-[13px] uppercase tracking-[0.1em]"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span
            className="absolute left-[14px] text-white/50 text-[16px] pointer-events-none"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal placeholder:text-white/50 ${
            prefix ? "!pl-8" : ""
          } ${suffix ? "!pr-10" : ""}`}
          style={{ fontFamily: "'Lato', sans-serif" }}
        />
        {suffix && (
          <span
            className="absolute right-4 text-white/50 text-[16px] pointer-events-none"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// Select component
function CalcSelect({
  label,
  value,
  onChange,
  options,
  id,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  id: string;
}) {
  return (
    <div className="flex flex-col gap-[8px]">
      <label
        htmlFor={id}
        className="text-white/70 text-[12px] md:text-[13px] uppercase tracking-[0.1em]"
        style={{ fontFamily: "'Lato', sans-serif" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[rgba(17,61,53,0.2)] border border-[#daaf3a] p-4 md:p-[18px] text-white text-[16px] leading-[24px] font-normal appearance-none cursor-pointer"
        style={{
          fontFamily: "'Lato', sans-serif",
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='12' height='8' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1.5L6 6.5L11 1.5' stroke='%23daaf3a' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 16px center",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[#09312a] text-white">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// Pie chart breakdown
function PaymentBreakdown({
  principal,
  propertyTax,
  insurance,
  pmi,
}: {
  principal: number;
  propertyTax: number;
  insurance: number;
  pmi: number;
}) {
  const total = principal + propertyTax + insurance + pmi;
  if (total === 0) return null;

  const segments = [
    { label: "Principal & Interest", value: principal, color: "#daaf3a" },
    { label: "Property Tax", value: propertyTax, color: "#e8c860" },
    { label: "Home Insurance", value: insurance, color: "#c9a84c" },
    ...(pmi > 0 ? [{ label: "PMI", value: pmi, color: "#9d7500" }] : []),
  ];

  // SVG donut chart
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  let cumulativeOffset = 0;

  return (
    <div className="flex flex-col items-center gap-8 md:gap-10">
      {/* Donut Chart */}
      <div className="relative w-[200px] h-[200px] md:w-[240px] md:h-[240px]">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full -rotate-90"
        >
          {segments.map((seg) => {
            const pct = seg.value / total;
            const dashLength = pct * circumference;
            const offset = cumulativeOffset;
            cumulativeOffset += dashLength;

            return (
              <circle
                key={seg.label}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="20"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-white/50 text-[11px] md:text-[12px] uppercase tracking-[0.1em]"
            style={{ fontFamily: "'Lato', sans-serif" }}
          >
            Monthly
          </span>
          <span
            className="font-heading text-[24px] md:text-[30px] gold-gradient-text leading-tight mt-1"
            style={{ fontWeight: 400 }}
          >
            {formatCurrency(total)}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-3 w-full max-w-[400px]">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-3">
            <div
              className="w-3 h-3 shrink-0"
              style={{ backgroundColor: seg.color }}
            />
            <div className="flex flex-col">
              <span
                className="text-white/60 text-[11px] md:text-[12px] leading-[16px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {seg.label}
              </span>
              <span
                className="text-white text-[13px] md:text-[14px] font-semibold leading-[18px]"
                style={{ fontFamily: "'Lato', sans-serif" }}
              >
                {formatCurrency(seg.value)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("500000");
  const [downPayment, setDownPayment] = useState("100000");
  const [downPaymentPercent, setDownPaymentPercent] = useState("20");
  const [interestRate, setInterestRate] = useState("5.5");
  const [loanTerm, setLoanTerm] = useState("25");
  const [propertyTax, setPropertyTax] = useState("3000");
  const [homeInsurance, setHomeInsurance] = useState("1500");
  const [lastEdited, setLastEdited] = useState<"amount" | "percent">("percent");

  const handleHomePriceChange = useCallback(
    (value: string) => {
      setHomePrice(value);
      const price = parseNumericInput(value);
      if (lastEdited === "percent") {
        const pct = parseNumericInput(downPaymentPercent);
        setDownPayment(Math.round(price * (pct / 100)).toString());
      } else {
        const dp = parseNumericInput(downPayment);
        if (price > 0) {
          setDownPaymentPercent(((dp / price) * 100).toFixed(1));
        }
      }
    },
    [lastEdited, downPaymentPercent, downPayment]
  );

  const handleDownPaymentChange = useCallback(
    (value: string) => {
      setDownPayment(value);
      setLastEdited("amount");
      const dp = parseNumericInput(value);
      const price = parseNumericInput(homePrice);
      if (price > 0) {
        setDownPaymentPercent(((dp / price) * 100).toFixed(1));
      }
    },
    [homePrice]
  );

  const handleDownPaymentPercentChange = useCallback(
    (value: string) => {
      setDownPaymentPercent(value);
      setLastEdited("percent");
      const pct = parseNumericInput(value);
      const price = parseNumericInput(homePrice);
      setDownPayment(Math.round(price * (pct / 100)).toString());
    },
    [homePrice]
  );

  const calculations = useMemo(() => {
    const price = parseNumericInput(homePrice);
    const dp = parseNumericInput(downPayment);
    const rate = parseNumericInput(interestRate);
    const years = parseInt(loanTerm) || 25;
    const annualTax = parseNumericInput(propertyTax);
    const annualInsurance = parseNumericInput(homeInsurance);
    const dpPercent = parseNumericInput(downPaymentPercent);

    const loanAmount = Math.max(price - dp, 0);
    const monthlyRate = rate / 100 / 12;
    const totalPayments = years * 12;

    // Monthly principal & interest
    let monthlyPI = 0;
    if (monthlyRate > 0 && totalPayments > 0 && loanAmount > 0) {
      monthlyPI =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);
    } else if (loanAmount > 0 && totalPayments > 0) {
      monthlyPI = loanAmount / totalPayments;
    }

    const monthlyTax = annualTax / 12;
    const monthlyInsurance = annualInsurance / 12;

    // PMI if down payment < 20%
    const monthlyPMI = dpPercent < 20 ? loanAmount * 0.005 / 12 : 0;

    const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI;
    const totalInterest = monthlyPI * totalPayments - loanAmount;
    const totalCost = monthlyPI * totalPayments + annualTax * years + annualInsurance * years + monthlyPMI * totalPayments;

    return {
      loanAmount,
      monthlyPI,
      monthlyTax,
      monthlyInsurance,
      monthlyPMI,
      totalMonthly,
      totalInterest,
      totalCost,
      totalPayments,
    };
  }, [homePrice, downPayment, downPaymentPercent, interestRate, loanTerm, propertyTax, homeInsurance]);

  return (
    <section id="mortgage-calculator" className="relative overflow-hidden">
      {/* Parallax Background */}
      <div
        className="absolute inset-0 parallax-bg"
        style={{ backgroundImage: "url(/images/buying-mortgage-bg.webp)" }}
      />
      <div className="absolute inset-0 bg-black/65" />

      <div className="relative z-10 max-w-[1440px] mx-auto px-5 md:px-10 lg:px-[60px] py-12 md:py-16 lg:py-[80px]">
        {/* Section Heading */}
        <ScrollReveal>
          <div className="text-center max-w-[700px] mx-auto mb-10 md:mb-14 lg:mb-[70px]">
            <h2
              className="font-heading text-[32px] md:text-[42px] lg:text-[50px] gold-gradient-text leading-[1.2] lg:leading-[60px]"
              style={{ fontWeight: 400 }}
            >
              Mortgage Calculator
            </h2>
            <p
              className="mt-4 md:mt-6 text-white/80 text-[14px] md:text-[16px] leading-[22px] md:leading-[26px]"
              style={{ fontFamily: "'Lato', sans-serif" }}
            >
              Estimate your monthly mortgage payments. Adjust the values below to
              see how different scenarios affect your budget.
            </p>
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-[80px] items-start">
          {/* Left: Inputs */}
          <ScrollReveal delay={0.1} className="flex-1 w-full min-w-0">
            <div className="flex flex-col gap-5 md:gap-6">
              {/* Home Price */}
              <CalcInput
                id="home-price"
                label="Home Price"
                value={formatNumber(parseNumericInput(homePrice))}
                onChange={(v) => handleHomePriceChange(v.replace(/,/g, ""))}
                prefix="$"
              />

              {/* Down Payment - Amount and Percent side by side */}
              <div className="grid grid-cols-2 gap-4">
                <CalcInput
                  id="down-payment"
                  label="Down Payment"
                  value={formatNumber(parseNumericInput(downPayment))}
                  onChange={(v) => handleDownPaymentChange(v.replace(/,/g, ""))}
                  prefix="$"
                />
                <CalcInput
                  id="down-payment-pct"
                  label="Down Payment %"
                  value={downPaymentPercent}
                  onChange={handleDownPaymentPercentChange}
                  suffix="%"
                />
              </div>

              {/* Interest Rate */}
              <CalcInput
                id="interest-rate"
                label="Interest Rate"
                value={interestRate}
                onChange={setInterestRate}
                suffix="%"
              />

              {/* Loan Term */}
              <CalcSelect
                id="loan-term"
                label="Amortization Period"
                value={loanTerm}
                onChange={setLoanTerm}
                options={[
                  { label: "10 Years", value: "10" },
                  { label: "15 Years", value: "15" },
                  { label: "20 Years", value: "20" },
                  { label: "25 Years", value: "25" },
                  { label: "30 Years", value: "30" },
                ]}
              />

              {/* Property Tax */}
              <CalcInput
                id="property-tax"
                label="Annual Property Tax"
                value={formatNumber(parseNumericInput(propertyTax))}
                onChange={(v) => setPropertyTax(v.replace(/,/g, ""))}
                prefix="$"
              />

              {/* Home Insurance */}
              <CalcInput
                id="home-insurance"
                label="Annual Home Insurance"
                value={formatNumber(parseNumericInput(homeInsurance))}
                onChange={(v) => setHomeInsurance(v.replace(/,/g, ""))}
                prefix="$"
              />
            </div>
          </ScrollReveal>

          {/* Right: Results */}
          <ScrollReveal delay={0.25} direction="right" className="flex-1 w-full min-w-0">
            <div className="bg-[rgba(9,49,42,0.6)] backdrop-blur-sm border border-[rgba(218,175,58,0.3)] p-6 md:p-8 lg:p-10">
              {/* Monthly Payment Header */}
              <div className="text-center mb-8 md:mb-10">
                <p
                  className="text-white/50 text-[12px] md:text-[13px] uppercase tracking-[0.15em] mb-2"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Estimated Monthly Payment
                </p>
                <motion.p
                  key={calculations.totalMonthly.toFixed(2)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="font-heading text-[36px] md:text-[48px] lg:text-[56px] gold-gradient-text leading-tight"
                  style={{ fontWeight: 400 }}
                >
                  {formatCurrency(calculations.totalMonthly)}
                </motion.p>
              </div>

              {/* Donut Chart */}
              <PaymentBreakdown
                principal={calculations.monthlyPI}
                propertyTax={calculations.monthlyTax}
                insurance={calculations.monthlyInsurance}
                pmi={calculations.monthlyPMI}
              />

              {/* Summary Stats */}
              <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-[rgba(218,175,58,0.2)]">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/60 text-[13px] md:text-[14px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Loan Amount
                    </span>
                    <span
                      className="text-white text-[14px] md:text-[16px] font-semibold"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {formatCurrency(calculations.loanAmount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/60 text-[13px] md:text-[14px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Total Interest Paid
                    </span>
                    <span
                      className="text-white text-[14px] md:text-[16px] font-semibold"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {formatCurrency(Math.max(calculations.totalInterest, 0))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/60 text-[13px] md:text-[14px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Total Cost Over {loanTerm} Years
                    </span>
                    <span
                      className="text-white text-[14px] md:text-[16px] font-semibold"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {formatCurrency(calculations.totalCost)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-white/60 text-[13px] md:text-[14px]"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      Total Payments
                    </span>
                    <span
                      className="text-white text-[14px] md:text-[16px] font-semibold"
                      style={{ fontFamily: "'Lato', sans-serif" }}
                    >
                      {calculations.totalPayments}
                    </span>
                  </div>
                </div>
              </div>

              {/* PMI Notice */}
              {calculations.monthlyPMI > 0 && (
                <div className="mt-6 p-4 bg-[rgba(218,175,58,0.08)] border border-[rgba(218,175,58,0.2)]">
                  <p
                    className="text-white/70 text-[12px] md:text-[13px] leading-[18px]"
                    style={{ fontFamily: "'Lato', sans-serif" }}
                  >
                    <span className="gold-gradient-text font-semibold">Note:</span>{" "}
                    Your down payment is less than 20%. Private Mortgage Insurance
                    (PMI) has been included in your estimate at approximately 0.5%
                    of the loan amount annually.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-8 md:mt-10">
                <a
                  href="/contact"
                  className="gold-gradient-bg flex items-center justify-center h-[47px] w-full text-[#09312a] font-semibold text-[14px] transition-all duration-300"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  Discuss Your Options with Aspen
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Disclaimer */}
        <p
          className="mt-8 md:mt-12 text-white/40 text-[11px] md:text-[12px] leading-[18px] text-center max-w-[800px] mx-auto"
          style={{ fontFamily: "'Lato', sans-serif" }}
        >
          This calculator provides estimates for informational purposes only. Actual
          mortgage rates, terms, and payments may vary based on your financial
          situation and lender requirements. Contact a mortgage professional for
          accurate pre-approval details.
        </p>
      </div>
    </section>
  );
}
