import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function MainFooter() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0f111a] border-t border-zinc-800 pt-16 pb-8 font-sans">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex -space-x-1">
                 <div className="w-8 h-8 bg-[#4c55a4] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                    S
                 </div>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                ShabbosRent
              </span>
            </Link>
            <p className="text-indigo-100 text-sm leading-relaxed max-w-xs">
              {t("footer.about")}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-[#4c55a4]/20 border border-[#4c55a4]/30 flex items-center justify-center text-indigo-200 hover:text-white hover:border-[#4c55a4] hover:bg-[#4c55a4] transition-all shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#4c55a4]/20 border border-[#4c55a4]/30 flex items-center justify-center text-indigo-200 hover:text-white hover:border-[#4c55a4] hover:bg-[#4c55a4] transition-all shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#4c55a4]/20 border border-[#4c55a4]/30 flex items-center justify-center text-indigo-200 hover:text-white hover:border-[#4c55a4] hover:bg-[#4c55a4] transition-all shadow-sm">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.quick_links")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.apartments")}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.about_us")}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.contact_us")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.support")}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.help_center")}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.privacy_policy")}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.terms_of_service")}
                </Link>
              </li>
              <li>
                <Link href="/trust" className="text-indigo-200 hover:text-white text-sm font-medium transition-colors">
                  {t("footer.trust_safety")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">{t("footer.contact_us")}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8a94e8] mt-0.5" />
                <span className="text-indigo-200 text-sm font-medium leading-relaxed">
                  {t("footer.address")}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8a94e8]" />
                <span className="text-indigo-200 text-sm font-medium">
                  +972 2 123 4567
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8a94e8]" />
                <span className="text-indigo-200 text-sm font-medium">
                  support@shabbosrent.com
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#4c55a4]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-indigo-200/80 text-sm font-medium">
            &copy; {new Date().getFullYear()} {t("footer.all_rights")}
          </p>
          <div className="flex items-center gap-6">
            <span className="text-indigo-200/80 hover:text-white transition-colors cursor-pointer text-sm">{t("footer.english")}</span>
            <span className="text-indigo-200/80 hover:text-white transition-colors cursor-pointer text-sm">{t("footer.currency")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
