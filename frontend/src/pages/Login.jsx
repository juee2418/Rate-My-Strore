import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  LogIn,
  Star,
  ShieldCheck,
  Search,
  MessageSquare,
  UserCheck
} from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', form);

      login(data.token, data.user);

      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'store_owner') {
        navigate('/owner');
      } else {
        navigate('/stores');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F5FA] via-white to-[#F3EDF7] flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-5xl bg-white border border-[#410666]/10 rounded-3xl shadow-[0_20px_60px_rgba(65,6,102,0.12)] overflow-hidden">

        <div className="grid md:grid-cols-2">

          {/* ================= LEFT SIDE ================= */}

          <div className="hidden md:flex bg-gradient-to-br from-[#410666] via-[#5B1680] to-[#74339A] text-white p-10 flex-col justify-between relative overflow-hidden">

            {/* Background shapes */}

            <div className="absolute -top-28 -right-28 w-72 h-72 bg-white/10 rounded-full" />

            <div className="absolute -bottom-32 -left-28 w-80 h-80 bg-[#B889C7]/15 rounded-full" />

            <div className="absolute top-1/3 right-16 w-28 h-28 border border-white/10 rounded-full" />

            <div className="absolute bottom-20 right-1/3 w-10 h-10 bg-white/5 rounded-full" />

            <div className="relative z-10">

              {/* LOGO */}

              <div className="flex items-center gap-3 mb-12">

                <div className="bg-white/10 border border-white/15 backdrop-blur-sm p-2.5 rounded-xl">
                  <Store size={23} />
                </div>

                <span className="text-xl font-bold tracking-tight">
                  StoreRate
                </span>

              </div>

              {/* HEADING */}

              <p className="text-[#D9B9E5] text-xs font-semibold tracking-[0.18em] mb-2">
                STORE RATING PLATFORM
              </p>

              <h2 className="text-3xl font-bold leading-tight">
                Choose better.
                <br />
                Shop smarter.
              </h2>

              <p className="text-white/65 text-sm leading-6 mt-4 max-w-sm">
                StoreRate helps customers discover stores,
                share their experiences, and make better
                decisions using real customer ratings.
              </p>

              {/* FEATURES */}

              <div className="mt-9 space-y-5">

                <Feature
                  icon={<Search size={17} />}
                  title="Discover Stores"
                  text="Find stores and check what customers think."
                />

                <Feature
                  icon={<Star size={17} />}
                  title="Rate & Review"
                  text="Share your experience after visiting a store."
                />

                <Feature
                  icon={<UserCheck size={17} />}
                  title="Store Management"
                  text="Store owners can monitor customer ratings."
                />

              </div>

            </div>

            {/* RATING CARD */}

            <div className="relative z-10 bg-white/[0.08] border border-white/15 rounded-xl p-4 mt-8 backdrop-blur-sm">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="bg-[#D9B9E5]/15 text-[#E4CBEA] p-2 rounded-lg">
                    <Store size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-semibold">
                      Local Store
                    </p>

                    <p className="text-xs text-white/50">
                      Customer rating
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-sm font-bold text-[#E4CBEA]">
                    4.6 / 5
                  </p>

                  <div className="flex gap-0.5 mt-1 text-[#E4CBEA]">

                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        fill="currentColor"
                      />
                    ))}

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ================= RIGHT SIDE ================= */}

          <div className="p-8 sm:p-10">

            {/* MOBILE LOGO */}

            <div className="flex md:hidden items-center gap-2 mb-10">

              <div className="bg-[#410666] text-white p-2 rounded-lg">
                <Store size={20} />
              </div>

              <span className="font-bold text-lg text-[#410666]">
                StoreRate
              </span>

            </div>

            {/* HEADER */}

            <div className="mb-8">

              <p className="text-[#410666] text-sm font-semibold mb-2 tracking-wide">
                WELCOME BACK
              </p>

              <h1 className="text-3xl font-bold text-slate-900">
                Sign in to StoreRate
              </h1>

              <p className="text-slate-500 text-sm mt-2 leading-5">
                Access your account to explore stores,
                manage ratings, and share your experience.
              </p>

            </div>

            {/* ERROR */}

            {error && (

              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
                {error}
              </div>

            )}

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}

              <div>

                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value
                    })
                  }
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none bg-white text-slate-800 placeholder-slate-400 transition focus:border-[#410666] focus:ring-2 focus:ring-[#410666]/15"
                />

              </div>

              {/* PASSWORD */}

              <div>

                <div className="flex justify-between mb-2">

                  <label className="text-sm font-medium text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs text-[#410666] hover:text-[#5B1680] hover:underline"
                  >
                    Forgot password?
                  </button>

                </div>

                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value
                    })
                  }
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none bg-white text-slate-800 placeholder-slate-400 transition focus:border-[#410666] focus:ring-2 focus:ring-[#410666]/15"
                />

              </div>

              {/* LOGIN BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#410666] hover:bg-[#350552] disabled:opacity-60 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(65,6,102,0.20)] transition duration-200"
              >

                <LogIn size={17} />

                {loading
                  ? 'Signing in...'
                  : 'Sign in'}

              </button>

            </form>

            {/* SECURITY */}

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-6">

              <ShieldCheck
                size={14}
                className="text-[#410666]"
              />

              Your account information is secure

            </div>

            {/* DIVIDER */}

            <div className="flex items-center gap-3 my-7">

              <div className="h-px bg-slate-200 flex-1" />

              <span className="text-xs text-slate-400">
                OR
              </span>

              <div className="h-px bg-slate-200 flex-1" />

            </div>

            {/* SIGNUP */}

            <p className="text-center text-sm text-slate-500">

              Don't have an account?{' '}

              <Link
                to="/signup"
                className="text-[#410666] font-semibold hover:text-[#5B1680] hover:underline"
              >
                Create an account
              </Link>

            </p>

            {/* INFORMATION */}

            <div className="mt-8 pt-5 border-t border-slate-100">

              <div className="flex items-start gap-3">

                <MessageSquare
                  size={16}
                  className="text-[#410666] mt-0.5"
                />

                <p className="text-xs text-slate-400 leading-5">
                  Your ratings and reviews help other customers
                  choose stores with confidence.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ================================================= */
/* FEATURE COMPONENT */
/* ================================================= */

function Feature({ icon, title, text }) {

  return (

    <div className="flex gap-3">

      <div className="w-9 h-9 flex-shrink-0 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center text-[#E4CBEA]">
        {icon}
      </div>

      <div>

        <h3 className="text-sm font-semibold">
          {title}
        </h3>

        <p className="text-xs text-white/55 mt-1">
          {text}
        </p>

      </div>

    </div>

  );
}