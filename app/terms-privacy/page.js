"use client";

import { useStore } from "@/lib/store";
import translations from "@/lib/translations";

export default function TermsPrivacy() {
  const { language } = useStore();
  const t = translations[language];

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-8 font-serif">
        {language === "ar"
          ? "الشروط والأحكام وسياسة الخصوصية والسرية"
          : "Terms and Conditions, Privacy and Confidentiality Policy"}
      </h1>
      <p className="text-center text-gray-600 mb-12">
        {language === "ar" ? "آخر تحديث: 9 نوفمبر 2025" : "Last updated: November 09, 2025"}
      </p>

      <div className="prose prose-lg mx-auto space-y-6">
        <p className="text-center text-gray-500 mb-12">
          {language === "ar"
            ? "يجمع هذا الوثيقة بين الشروط والأحكام وسياسة الخصوصية والسرية لثمرات الأوراق. يرجى قراءة جميع الأقسام بعناية."
            : "This document combines the Terms and Conditions with the Privacy and Confidentiality Policy for Thamarat Al Awrak. Please read all sections carefully."}
        </p>

        {/* Terms and Conditions Section */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
            {language === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
          </h2>

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "مقدمة" : "Introduction"}
          </h3>
          <p>
            {language === "ar"
              ? 'تشكل هذه الشروط والأحكام اتفاقية قانونية ملزمة بينك، سواء شخصيًا أو نيابة عن كيان ("أنت")، وبين ثمرات الأوراق ("نحن" أو "لنا")، بشأن وصولك إلى موقع thamaratalawrak.com واستخدامه بالإضافة إلى أي شكل إعلامي آخر أو قناة إعلامية أو موقع محمول أو تطبيق محمول مرتبط أو مرتبط بطريقة أخرى (مجتمعًا، "الموقع").'
              : "These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity (“you”), and Thamarat Al Awrak (“we,” “us,” or “our”), concerning your access to and use of the thamaratalawrak.com website as well as any other media form, media channel, mobile website, or mobile application related, linked, or otherwise connected thereto (collectively, the “Site”)."}
          </p>
          <p>
            {language === "ar"
              ? "توافق أنك بوصولك إلى الموقع، قد قرأت وفهمت وتوافق على الالتزام بجميع هذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط والأحكام، يجب عليك عدم الوصول إلى الموقع."
              : "You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these Terms and Conditions. If you do not agree with any part of these Terms and Conditions, you must not access the Site."}
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "حسابات المستخدمين" : "User Accounts"}
          </h3>
          <p>
            {language === "ar"
              ? "إذا قمت بإنشاء حساب على الموقع، أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور وتقييد الوصول إلى جهازك لمنع الاستخدام غير المصرح به لحسابك. توافق على قبول المسؤولية عن جميع الأنشطة التي تحدث تحت حسابك أو كلمة المرور. نحتفظ بحق رفض الخدمة أو إنهاء الحسابات أو إزالة أو تعديل المحتوى في تقديرنا الوحيد."
              : "If you create an account on the Site, you are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer and for restricting access to your computer to prevent unauthorized use of your account. You agree to accept responsibility for all activities that occur under your account or password and for restricting access to your computer to prevent unauthorized use of your account. We reserve the right to refuse service, terminate accounts, or remove or edit content in our sole discretion."}
          </p>

          {/* Add other Terms sections similarly from the provided template, bilingual */}
          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "المنتجات/الخدمات" : "Products/Services"}
          </h3>
          <p>
            {language === "ar"
              ? "ثمرات الأوراق هو متجر إلكتروني للكتب يقع في تونس ويتخصص في الكتب الإسلامية. نقدم مجموعة متنوعة من المنتجات، بما في ذلك وليس مقتصرًا على، الأدب الإسلامي، دراسات القرآن، مجموعات الحديث، ونصوص دينية أخرى. جميع المنتجات تخضع للتوافر، ونحتفظ بحق إيقاف أي منتج في أي وقت دون إشعار."
              : "Thamarat Al Awrak is an online bookstore based in Tunisia specializing in Islamic books. We offer a variety of products, including but not limited to, Islamic literature, Quranic studies, Hadith collections, and other religious texts. All products are subject to availability, and we reserve the right to discontinue any product at any time without notice."}
          </p>

          {/* Continue adding sections: Purchases and Payment, Delivery/Shipping, Refunds Policy, Prohibited Activities, Intellectual Property Rights, User Representations, Submissions, Third-Party Websites, Site Management, Modifications, Termination, Governing Law, Dispute Resolution, Corrections, Disclaimer, Limitations of Liability, Indemnification, User Data, Electronic Communications, Miscellaneous, Contact Us */}

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "الاتصال بنا" : "Contact Us"}
          </h3>
          <p>
            {language === "ar"
              ? "إذا كان لديك أي أسئلة حول هذه الشروط والأحكام، يرجى الاتصال بنا على: ثمرات الأوراق، [العنوان في تونس]، البريد الإلكتروني: info@thamaratalawrak.com، الهاتف: [رقم الهاتف]."
              : "If you have any questions about these Terms and Conditions, please contact us at: Thamarat Al Awrak, [Address in Tunisia], Email: info@thamaratalawrak.com, Phone: [Phone Number]."}
          </p>
        </section>

        {/* Privacy and Confidentiality Section */}
        <section className="mt-12">
          <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
            {language === "ar" ? "سياسة الخصوصية والسرية" : "Privacy and Confidentiality Policy"}
          </h2>

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "مقدمة" : "Introduction"}
          </h3>
          <p>
            {language === "ar"
              ? 'توضح إشعار الخصوصية هذا لثمرات الأوراق ("الشركة" أو "نحن" أو "لنا" أو "نا") كيف ولماذا قد نجمع ونخزن ونستخدم و/أو نشارك ("نعالج") معلوماتك عند استخدام خدماتنا ("الخدمات")، مثل عند زيارة موقعنا على thamaratalawrak.com.'
              : 'This privacy notice for Thamarat Al Awrak (doing business as Thamarat Al Awrak) ("Company," "we," "us," or "our"), describes how and why we might collect, store, use, and/or share ("process") your information when you use our services ("Services"), such as when you visit our website at thamaratalawrak.com.'}
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "المعلومات التي نجمعها" : "Information We Collect"}
          </h3>
          <p>
            {language === "ar"
              ? "نجمع معلومات عنك بعدة طرق. تشمل المعلومات التي قد نجمعها: البيانات الشخصية مثل الاسم، عنوان البريد الإلكتروني، العنوان البريدي، رقم الهاتف، معلومات الدفع؛ البيانات الديموغرافية مثل العمر، الجنس، الموقع؛ بيانات أخرى مثل عنوان IP، نوع المتصفح، معلومات الجهاز، تاريخ الشراء، التفضيلات."
              : "We may collect information about you in a variety of ways. The information we may collect includes: Personal Data like name, email address, mailing address, phone number, payment information; Demographic Data like age, gender, location; Other Data like IP address, browser type, device information, purchase history, preferences."}
          </p>

          {/* Continue adding sections: How We Use Your Information, Sharing Your Information, Tracking Technologies, Third-Party Services, Security of Your Information (emphasize confidentiality), Options Regarding Your Information, Children's Privacy, Controls for Do-Not-Track Features, Changes to This Privacy Policy, Contact Us */}

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "أمان معلوماتك" : "Security of Your Information"}
          </h3>
          <p>
            {language === "ar"
              ? "لقد نفذنا تدابير أمنية فنية وتنظيمية مناسبة مصممة لحماية أمان أي معلومات شخصية نعالجها. ومع ذلك، يرجى ملاحظة أننا لا يمكننا ضمان أمان بياناتك المرسلة إلى الموقع؛ أي نقل يكون على مسؤوليتك الخاصة. نؤكد على السرية: معلوماتك مخزنة بشكل آمن مع وصول محدود للموظفين المصرح لهم بناءً على الحاجة إلى المعرفة. نجري مراجعات أمنية منتظمة ونقوم بتدريب الموظفين على ممارسات حماية البيانات للحفاظ على السرية."
              : "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please note that we cannot guarantee the security of your data transmitted to the Site; any transmission is at your own risk. Emphasis on confidentiality: Your information is stored securely with access limited to authorized personnel on a need-to-know basis. We conduct regular security audits and train staff on data protection practices to maintain confidentiality."}
          </p>

          <h3 className="text-2xl font-semibold mb-4">
            {language === "ar" ? "الاتصال بنا" : "Contact Us"}
          </h3>
          <p>
            {language === "ar"
              ? "إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى الاتصال بنا على: ثمرات الأوراق، [العنوان في تونس]، البريد الإلكتروني: privacy@thamaratalawrak.com، الهاتف: [رقم الهاتف]."
              : "If you have any questions about this Privacy Policy, please contact us at: Thamarat Al Awrak, [Address in Tunisia], Email: privacy@thamaratalawrak.com, Phone: [Phone Number]."}
          </p>
        </section>

        <p className="mt-8 text-sm text-gray-500 text-center">
          {language === "ar"
            ? "ملاحظة: هذه الوثيقة متوفرة باللغة الإنجليزية. يمكن طلب ترجمة عربية كاملة عند الاتصال بنا."
            : "Note: This document is provided in English. A full Arabic translation is available upon request. Please contact us for the Arabic version."}
        </p>
      </div>
    </div>
  );
}
