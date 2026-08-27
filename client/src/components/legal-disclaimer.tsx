import { ShieldCheck } from "lucide-react";

export const NAMFISA = {
  tel: "+264 61 290 5000",
  email: "info@namfisa.com.na",
  website: "www.namfisa.com.na",
};

/**
 * Full disclaimer for site footers (rendered on dark backgrounds).
 */
export function FooterDisclaimer() {
  return (
    <div className="py-8 border-t border-white/10 space-y-6" data-testid="footer-disclaimer">
      <div>
        <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Privacy &amp; Client Information</h4>
        <p className="text-xs leading-relaxed text-gray-500 max-w-4xl">
          The information you provide is treated as confidential and is used solely for the purpose of assessing your
          insurance needs and providing a quotation or advice. Quantz Financial Services does not share your personal
          information with third parties for marketing purposes without your consent.
        </p>
      </div>

      <div>
        <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-2">Regulation</h4>
        <p className="text-xs leading-relaxed text-gray-500 max-w-4xl">
          Quantz Financial Services CC is an authorised financial services provider, regulated by the Namibia Financial
          Institutions Supervisory Authority (NAMFISA).
        </p>
      </div>

      <div>
        <h4 className="text-white/80 text-xs font-semibold uppercase tracking-widest mb-3">NAMFISA Contact Details</h4>
        <ul className="flex flex-col sm:flex-row sm:flex-wrap gap-x-8 gap-y-2 text-xs text-gray-500">
          <li>
            <span className="text-gray-600">Tel:</span>{" "}
            <a href={`tel:${NAMFISA.tel.replace(/\s/g, "")}`} className="hover:text-white transition-colors">
              {NAMFISA.tel}
            </a>
          </li>
          <li>
            <span className="text-gray-600">Email:</span>{" "}
            <a href={`mailto:${NAMFISA.email}`} className="hover:text-white transition-colors">
              {NAMFISA.email}
            </a>
          </li>
          <li>
            <span className="text-gray-600">Website:</span>{" "}
            <a
              href={`https://${NAMFISA.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              {NAMFISA.website}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 * Condensed disclaimer shown next to the submit button on quote forms.
 */
export function FormDisclaimer() {
  return (
    <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-2" data-testid="form-disclaimer">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-600 flex-shrink-0" aria-hidden="true" />
        <p className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Confidential &amp; NAMFISA Regulated</p>
      </div>
      <p className="text-[11px] leading-relaxed text-gray-500">
        The information you provide is treated as confidential and is used solely to assess your insurance needs and
        provide a quotation or advice. We do not share your personal information with third parties for marketing
        purposes without your consent.
      </p>
      <p className="text-[11px] leading-relaxed text-gray-500">
        Quantz Financial Services CC is an authorised financial services provider, regulated by NAMFISA — Tel{" "}
        {NAMFISA.tel},{" "}
        <a href={`mailto:${NAMFISA.email}`} className="underline hover:text-gray-700">
          {NAMFISA.email}
        </a>
        ,{" "}
        <a
          href={`https://${NAMFISA.website}`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-700"
        >
          {NAMFISA.website}
        </a>
        .
      </p>
    </div>
  );
}
