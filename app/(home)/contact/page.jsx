"use client";
import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [countries, setCountries] = useState([]);
  const [captcha, setCaptcha] = useState({
    token: "",
    question: "Loading challenge...",
  });
  const [blockwords, setBlockwords] = useState([]);
  const [disposableDomains, setDisposableDomains] = useState([]);
  const [protectedDomains, setProtectedDomains] = useState([]);
  const [fieldWarnings, setFieldWarnings] = useState({});
  const [formData, setFormData] = useState({
    _captcha_token: "",
    _captcha_answer: "",
    name: "",
    email: "",
    subject: "",
    country: "",
    phone: "",
    messsage: "",
    _hp_bio_field: "",
  });
  const [status, setStatus] = useState({
    loading: false,
    message: "",
    error: false,
  });
  const [timestamp, setTimestamp] = useState(0);

  useEffect(() => {
    setTimestamp(Date.now());
    // Fetch live form metadata (countries, security captcha & anti-spam rules) from API
    fetch("https://bitssc.bitss.one/api/forms/frm_789be0979658")
      .then((res) => res.json())
      .then((data) => {
        if (data.form?.blockwords) setBlockwords(data.form.blockwords);
        if (data.form?.disposable_domains)
          setDisposableDomains(data.form.disposable_domains);
        if (data.form?.protected_domains)
          setProtectedDomains(data.form.protected_domains);
        if (data.success && data.form?.countries) {
          setCountries(data.form.countries);
          const defaultCountry =
            data.form.countries.find(
              (c) => c.name === "United States" || c.iso2 === "US",
            ) || data.form.countries[0];
          if (defaultCountry) {
            const dial = defaultCountry.dial_code || "+1";
            const phoneFields = ["phone"];
            setFormData((prev) => {
              const updates = { ...prev };
              if (!prev["country"]) updates["country"] = defaultCountry.name;
              phoneFields.forEach((fId) => {
                if (!prev[fId] || prev[fId].trim() === "")
                  updates[fId] = dial + " ";
              });
              return updates;
            });
          }
        }
        if (data.form?.captcha) {
          setCaptcha(data.form.captcha);
          setFormData((prev) => ({
            ...prev,
            _captcha_token: data.form.captcha.token,
          }));
        }
      })
      .catch(() => {});
  }, []);

  const checkSpamWarning = (fieldName, val) => {
    if (!val || typeof val !== "string") {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
      return;
    }
    const cleanVal = val.toLowerCase().trim();
    if (cleanVal.length < 2) {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
      return;
    }
    const isEmail = fieldName.toLowerCase().includes("email");
    let matched = null;
    if (isEmail) {
      const atIdx = cleanVal.lastIndexOf("@");
      if (atIdx !== -1) {
        const emailDomain = cleanVal.slice(atIdx + 1).trim();
        const dotIdx = emailDomain.lastIndexOf(".");
        const isComplete = dotIdx > 0 && emailDomain.length - dotIdx - 1 >= 2;
        if (isComplete) {
          const isProtected = protectedDomains.some(
            (p) => emailDomain === p || emailDomain.endsWith("." + p),
          );
          if (!isProtected && disposableDomains.length > 0) {
            const found = disposableDomains.find(
              (d) => emailDomain === d || emailDomain.endsWith("." + d),
            );
            if (found) matched = `Disposable email provider: ${found}`;
          }
        }
      }
    } else {
      if (
        /(?:\[url[=\]]|<a\s+[^>]*href|<\/a>|\[link[=\]]|<script\b)/i.test(
          cleanVal,
        )
      ) {
        matched = "HTML or BBCode link tags";
      } else if (
        /(?:https?:\/\/)?(?:t\.me|telegram\.me|wa\.me|bit\.ly|tinyurl\.com)\/[a-zA-Z0-9_\-\.\/]+/i.test(
          cleanVal,
        )
      ) {
        matched = "Suspicious redirect/messaging link";
      } else if (/(.){6,}/u.test(cleanVal)) {
        matched = "Repetitive character flood";
      }
      if (!matched && blockwords.length > 0) {
        for (let i = 0; i < blockwords.length; i++) {
          const bw = (blockwords[i] || "").toLowerCase().trim();
          if (!bw || bw.length < 2) continue;
          if (bw.startsWith(".")) {
            const escaped = bw.replace(/[.*+?^${\}()|[\]\\]/g, "\\$&");
            const tldRegex = new RegExp(
              "[a-z0-9_-]+" + escaped + "(?=[\\s\\/.,:;?!)\\\"']|$)",
              "i",
            );
            if (tldRegex.test(cleanVal)) {
              matched = blockwords[i];
              break;
            }
          } else {
            const escaped = bw.replace(/[.*+?^${\}()|[\]\\]/g, "\\$&");
            const isWord = /^[a-zA-Z0-9_]+$/.test(bw);
            const wordRegex = isWord
              ? new RegExp(
                  "(?:^|[^a-zA-Z0-9_\\u00C0-\\u024F])" +
                    escaped +
                    "(?=[^a-zA-Z0-9_\\u00C0-\\u024F]|$)",
                  "i",
                )
              : new RegExp(escaped, "i");
            if (wordRegex.test(cleanVal)) {
              matched = blockwords[i];
              break;
            }
          }
        }
      }
    }
    if (matched) {
      setFieldWarnings((prev) => ({
        ...prev,
        [fieldName]: `⚠️ Blocked pattern detected: ${matched}`,
      }));
    } else {
      setFieldWarnings((prev) => {
        if (!prev[fieldName]) return prev;
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    checkSpamWarning(name, value);
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.target.value;
    const countryObj = countries.find(
      (c) =>
        c.name?.toLowerCase() === selectedCountry?.toLowerCase() ||
        c.iso2?.toLowerCase() === selectedCountry?.toLowerCase(),
    );
    const dial = countryObj?.dial_code || "+1";
    const phoneFields = ["phone"];
    setFormData((prev) => {
      const updates = {
        ...prev,
        [e.target.name || "country"]: selectedCountry,
      };
      phoneFields.forEach((fId) => {
        const cleanPhone = (prev[fId] || "").trim();
        let newPhone = dial + " ";
        if (cleanPhone.startsWith("+")) {
          const match = cleanPhone.match(/^\+\d+\s*(.*)$/);
          const rest = match ? match[1] : "";
          newPhone = dial + (rest ? " " + rest : " ");
        } else if (cleanPhone) {
          newPhone = dial + " " + cleanPhone;
        }
        updates[fId] = newPhone;
      });
      return updates;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(fieldWarnings).length > 0) {
      setStatus({
        loading: false,
        message:
          "⚠️ Submission blocked: Please remove prohibited words or links from the highlighted fields.",
        error: true,
      });
      return;
    }
    setStatus({ loading: true, message: "", error: false });
    try {
      const res = await fetch(
        "https://bitssc.bitss.one/api/forms/frm_789be0979658/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            ...formData,
            _bcf_ts: timestamp,
            _client_tz:
              typeof Intl !== "undefined" && Intl.DateTimeFormat
                ? Intl.DateTimeFormat().resolvedOptions().timeZone
                : "",
          }),
        },
      );
      let data = null;
      try {
        data = await res.json();
      } catch (_) {
        data = null;
      }
      if (data && data.captcha) {
        setCaptcha(data.captcha);
        setFormData((prev) => ({
          ...prev,
          _captcha_token: data.captcha.token,
          _captcha_answer: "",
        }));
      }
      if (res.ok && data && data.success) {
        alert(data?.message || "Message sent successfully");
        setStatus({
          loading: false,
          message: data.message || "Thank you! Submission received.",
          error: false,
        });
        setFormData({
          _captcha_token: "",
          _captcha_answer: "",
          name: "",
          email: "",
          subject: "",
          country: "",
          phone: "",
          messsage: "",
          _hp_bio_field: "",
          ...(data && data.captcha
            ? { _captcha_token: data.captcha.token, _captcha_answer: "" }
            : {}),
        });
      } else {
        alert(data?.message || "Some thing went wrong");
        const errMsg =
          data && (data.message || data.error)
            ? data.message || data.error
            : res.status === 429
              ? data?.message ||
                "A message from this email address has already been received recently. Please wait before submitting again."
              : res.status >= 500
                ? `Server Error (${res.status}: ${res.statusText || "Internal Error"})`
                : "Submission failed. Please check form inputs.";
        setStatus({ loading: false, message: errMsg, error: true });
      }
    } catch (err) {
      const connErr =
        err && err.message
          ? `Connection Error: ${err.message}`
          : "Network error. Please try again.";
      setStatus({ loading: false, message: connErr, error: true });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 px-5 md:px-0">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-destructive to-pink-500">
              Touch
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Have questions about our platform? We're here to help. Reach out to
            our team and we'll get back to you as soon as possible.
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 items-start">
        {/* Contact Info (Left Side) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2 space-y-8 order-2 lg:order-1"
        >
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/60 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-bl-full transition-transform duration-500 group-hover:scale-110 -z-0"></div>

            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 relative z-10">
              Contact Information
            </h3>

            <div className="space-y-6 relative z-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-2xl flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Email Us
                  </p>
                  <a
                    href="mailto:support@sosay.org"
                    className="text-slate-900 dark:text-white font-semibold hover:text-destructive transition-colors"
                  >
                    support@bobosohomail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Call Us
                  </p>
                  <a
                    href="tel:+0033666100010"
                    className="text-slate-900 dark:text-white font-semibold hover:text-blue-600 transition-colors"
                  >
                    +0033666100010
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    Our Location
                  </p>
                  <p className="text-slate-900 dark:text-white font-semibold">
                    8 rue de Dublin, 34200, <br /> Sète, France
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map View */}
          <div className="bg-white dark:bg-slate-900 p-2 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800/60 overflow-hidden w-full h-[400px] lg:h-[670px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2894.23853119106!2d3.684126!3d43.39868!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b1348f3b1451f1%3A0x1d5d14e04ed2bb45!2s8%20Rue%20de%20Dublin%2C%2034200%20S%C3%A8te%2C%20France!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, borderRadius: "1rem" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </motion.div>

        {/* Contact Form (Right Side) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-3 order-1 lg:order-2"
        >
          <form
            onSubmit={handleSubmit}
            className="space-y-5 w-full p-8 md:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/60 shadow-xl shadow-slate-200/40 dark:shadow-none"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Send a Message
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Fill out the form below and we will get back to you shortly.
              </p>
            </div>
            {status.message && (
              <div
                className={`p-4 rounded-lg text-sm ${status.error ? "bg-red-50 text-red-700 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
              >
                {status.message}
              </div>
            )}
            <input
              type="text"
              name="_hp_bio_field"
              value={formData._hp_bio_field}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name || ""}
                onChange={handleChange}
                style={{
                  borderColor: fieldWarnings["name"] ? "#dc2626" : undefined,
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              />
              {fieldWarnings["name"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["name"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                required
                value={formData.email || ""}
                onChange={handleChange}
                style={{
                  borderColor: fieldWarnings["email"] ? "#dc2626" : undefined,
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              />
              {fieldWarnings["email"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["email"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Subject / Query *
              </label>
              <input
                type="text"
                name="subject"
                placeholder="Enter Subject / Query..."
                required
                value={formData.subject || ""}
                onChange={handleChange}
                style={{
                  borderColor: fieldWarnings["subject"] ? "#dc2626" : undefined,
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              />
              {fieldWarnings["subject"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["subject"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Country *
              </label>
              <select
                name="country"
                required
                value={formData.country || ""}
                onChange={handleCountryChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              >
                <option value="">-- Select Country --</option>
                {countries.map((c) => (
                  <option key={c.iso2 || c.name} value={c.name}>
                    {c.flag ? `${c.flag} ` : ""}
                    {c.name}
                    {c.dial_code ? ` (${c.dial_code})` : ""}
                  </option>
                ))}
              </select>
              {fieldWarnings["country"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["country"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 000-0000"
                required
                value={formData.phone || ""}
                onChange={handleChange}
                style={{
                  borderColor: fieldWarnings["phone"] ? "#dc2626" : undefined,
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              />
              {fieldWarnings["phone"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["phone"]}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
                Messsage *
              </label>
              <textarea
                name="messsage"
                rows={4}
                placeholder="How can I help you?"
                required
                value={formData.messsage || ""}
                onChange={handleChange}
                style={{
                  borderColor: fieldWarnings["messsage"]
                    ? "#dc2626"
                    : undefined,
                }}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 transition"
              />
              {fieldWarnings["messsage"] && (
                <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-1 flex items-center gap-1">
                  {fieldWarnings["messsage"]}
                </p>
              )}
            </div>

            {/* Dynamic Math CAPTCHA */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
                Security Check:{" "}
                <strong className="text-red-600 dark:text-red-400">
                  {captcha.question}
                </strong>{" "}
                *
              </label>
              <input
                type="hidden"
                name="_captcha_token"
                value={formData._captcha_token || ""}
              />
              <input
                type="text"
                name="_captcha_answer"
                placeholder="Enter answer (e.g. 10 or ten)"
                required
                autoComplete="off"
                value={formData._captcha_answer || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={status.loading}
              className="w-full mt-4 py-4 px-6 bg-destructive hover:bg-destructive/90 text-white text-lg font-semibold rounded-2xl transition-all duration-300 shadow-lg shadow-destructive/25 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status.loading ? (
                "Sending..."
              ) : (
                <>
                  Send Message{" "}
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* BITSS Branding Footer */}
            <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-800 text-center font-sans">
              <img
                src="https://bitssc.bitss.one/assets/image.png"
                alt="BITSS Cyber Security"
                className="h-10 w-auto mx-auto mb-3 object-contain opacity-80 hover:opacity-100 transition-opacity"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                This form is powered and protected by{" "}
                <strong>BITSS Cyber Security</strong>
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                &copy; {new Date().getFullYear()} BFIN. BITSS by BFIN. All
                rights reserved.
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
