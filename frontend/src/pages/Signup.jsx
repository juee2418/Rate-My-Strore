import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  UserPlus,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function Signup() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const PRIMARY = '#410666';
  const PURPLE = '#6B238A';
  const LIGHT = '#F7F1FA';
  const BORDER = '#E9DDF0';

  function validate() {
    const nameLength = form.name.trim().length;

    if (nameLength < 10 || nameLength > 60) {
      return 'Name must be between 10 and 60 characters';
    }

    if (form.address.length > 400) {
      return 'Address cannot exceed 400 characters';
    }

    if (
      form.password.length < 8 ||
      form.password.length > 16
    ) {
      return 'Password must be 8-16 characters';
    }

    if (!/[A-Z]/.test(form.password)) {
      return 'Password needs at least one uppercase letter';
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
      return 'Password needs at least one special character';
    }

    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/signup', form);

      login(data.token, data.user);
      navigate('/stores');
    } catch (err) {
      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Signup failed'
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(field, value) {
    setForm({
      ...form,
      [field]: value
    });

    if (error) {
      setError('');
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-8 sm:py-12 relative overflow-hidden"
      style={{
        background: `
          radial-gradient(circle at 10% 10%, #EBDCF2 0%, transparent 28%),
          radial-gradient(circle at 90% 90%, #E4D1ED 0%, transparent 30%),
          linear-gradient(135deg, #FBF9FC 0%, #FFFFFF 48%, #F8F2FA 100%)
        `
      }}
    >

      {/* DECORATIVE SHAPES */}

      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-40"
        style={{
          background:
            'linear-gradient(135deg, #D9BDE5, #F3E9F7)'
        }}
      />

      <div
        className="absolute -bottom-40 -right-32 w-96 h-96 rounded-full opacity-40"
        style={{
          background:
            'linear-gradient(135deg, #E7D5EF, #D4B6E2)'
        }}
      />

      <div
        className="absolute top-20 right-[12%] w-4 h-4 rounded-full"
        style={{ backgroundColor: '#A56ABD' }}
      />

      <div
        className="absolute bottom-24 left-[12%] w-3 h-3 rounded-full"
        style={{ backgroundColor: '#C29AD1' }}
      />


      {/* MAIN CARD */}

      <div
        className="relative w-full max-w-5xl bg-white rounded-[32px] overflow-hidden"
        style={{
          border: `1px solid ${BORDER}`,
          boxShadow:
            '0 30px 80px rgba(65, 6, 102, 0.13)'
        }}
      >

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* LEFT PANEL */}

          <div
            className="hidden lg:flex relative overflow-hidden p-10 xl:p-12 text-white flex-col justify-between"
            style={{
              background:
                'linear-gradient(145deg, #410666 0%, #572077 48%, #74369A 100%)'
            }}
          >

            {/* Background circles */}

            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.06)'
              }}
            />

            <div
              className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full"
              style={{
                backgroundColor: 'rgba(255,255,255,0.05)'
              }}
            />

            <div
              className="absolute top-1/2 right-10 w-24 h-24 rounded-full border"
              style={{
                borderColor: 'rgba(255,255,255,0.12)'
              }}
            />


            {/* LOGO */}

            <div className="relative z-10">

              <div className="flex items-center gap-3">

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.14)',
                    border:
                      '1px solid rgba(255,255,255,0.18)'
                  }}
                >
                  <Store className="w-6 h-6" />
                </div>

                <div>

                  {/* OLD NAME RESTORED */}
                  <p className="text-xl font-extrabold tracking-tight">
                    StoreRate
                  </p>

                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                    Rate • Review • Discover
                  </p>

                </div>

              </div>


              {/* HERO */}

              <div className="mt-20">

                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-5"
                  style={{
                    backgroundColor:
                      'rgba(255,255,255,0.10)',
                    border:
                      '1px solid rgba(255,255,255,0.12)'
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Welcome to StoreRate
                </div>

                <h2 className="text-4xl xl:text-5xl font-extrabold leading-[1.08]">
                  Discover.
                  <br />
                  Experience.
                  <br />

                  <span className="text-white/60">
                    Trust.
                  </span>
                </h2>

                <p className="text-sm text-white/65 leading-6 mt-6 max-w-sm">
                  Find stores, explore customer experiences,
                  and share your own ratings to help others
                  make better choices.
                </p>

              </div>


              {/* FEATURES */}

              <div className="mt-10 space-y-4">

                <Feature
                  title="Discover stores"
                  text="Explore stores and customer experiences."
                />

                <Feature
                  title="Share your experience"
                  text="Rate stores and help other customers."
                />

                <Feature
                  title="Make smarter choices"
                  text="Use real customer ratings before you shop."
                />

              </div>

            </div>


            {/* BOTTOM */}

            <div
              className="relative z-10 mt-12 p-4 rounded-2xl"
              style={{
                backgroundColor:
                  'rgba(255,255,255,0.08)',
                border:
                  '1px solid rgba(255,255,255,0.12)'
              }}
            >

              <div className="flex items-center gap-3">

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    backgroundColor:
                      'rgba(255,255,255,0.10)'
                  }}
                >
                  <ShieldCheck className="w-5 h-5" />
                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Your information is secure
                  </p>

                  <p className="text-xs text-white/50 mt-0.5">
                    We keep your account protected.
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* RIGHT FORM */}

          <div className="p-7 sm:p-10 lg:p-12">

            {/* MOBILE LOGO */}

            <div className="flex lg:hidden items-center gap-3 mb-8">

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white"
                style={{
                  background:
                    `linear-gradient(135deg, ${PRIMARY}, ${PURPLE})`
                }}
              >
                <Store className="w-6 h-6" />
              </div>

              <div>

                <h1
                  className="text-xl font-extrabold"
                  style={{ color: PRIMARY }}
                >
                  StoreRate
                </h1>

                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Rate • Review • Discover
                </p>

              </div>

            </div>


            {/* HEADER */}

            <div className="mb-7">

              <div
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-3"
                style={{ color: PRIMARY }}
              >
                <span
                  className="w-7 h-px"
                  style={{ backgroundColor: PRIMARY }}
                />
                Create account
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Start your journey
              </h1>

              <p className="text-sm text-slate-500 mt-2 leading-6">
                Create your account and start discovering
                stores through real customer experiences.
              </p>

            </div>


            {/* ERROR */}

            {error && (
              <div
                className="rounded-xl px-4 py-3 mb-5 text-sm"
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  color: '#DC2626'
                }}
              >
                {error}
              </div>
            )}


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-4"
            >

              {/* NAME */}

              <InputField
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) =>
                  updateField('name', e.target.value)
                }
              />

              <div className="flex justify-between -mt-2 px-1">

                <span
                  className={`text-[11px] ${
                    form.name.trim().length < 10
                      ? 'text-red-400'
                      : 'text-slate-400'
                  }`}
                >
                  {form.name.trim().length}/60 characters
                </span>

                {form.name.trim().length < 10 && (
                  <span className="text-[11px] text-red-400">
                    Minimum 10
                  </span>
                )}

              </div>


              {/* EMAIL */}

              <InputField
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  updateField('email', e.target.value)
                }
              />


              {/* ADDRESS */}

              <div>

                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Address
                </label>

                <textarea
                  rows={2}
                  maxLength={400}
                  value={form.address}
                  onChange={(e) =>
                    updateField(
                      'address',
                      e.target.value
                    )
                  }
                  placeholder="Enter your address"
                  className="w-full px-4 py-3 rounded-xl outline-none resize-none text-sm text-slate-800 placeholder-slate-400 transition-all"
                  style={{
                    border: `1px solid ${BORDER}`
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor =
                      PRIMARY;
                    e.currentTarget.style.boxShadow =
                      `0 0 0 3px rgba(65,6,102,0.07)`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor =
                      BORDER;
                    e.currentTarget.style.boxShadow =
                      'none';
                  }}
                />

                <p className="text-[11px] text-slate-400 text-right mt-1">
                  {form.address.length}/400
                </p>

              </div>


              {/* PASSWORD */}

              <InputField
                label="Password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) =>
                  updateField(
                    'password',
                    e.target.value
                  )
                }
              />

              <p className="text-[11px] text-slate-400 -mt-2 px-1">
                8-16 characters • 1 uppercase • 1 special character
              </p>


              {/* BUTTON */}

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 text-white font-bold py-3.5 rounded-xl transition-all duration-200 mt-2 disabled:opacity-60"
                style={{
                  background:
                    `linear-gradient(135deg, ${PRIMARY}, ${PURPLE})`,
                  boxShadow:
                    '0 8px 20px rgba(65,6,102,0.18)'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.transform =
                      'translateY(-1px)';
                    e.currentTarget.style.boxShadow =
                      '0 12px 25px rgba(65,6,102,0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform =
                    'translateY(0)';
                  e.currentTarget.style.boxShadow =
                    '0 8px 20px rgba(65,6,102,0.18)';
                }}
              >

                <UserPlus className="w-4 h-4" />

                {loading
                  ? 'Creating account...'
                  : 'Create Account'
                }

              </button>

            </form>


            {/* LOGIN */}

            <p className="text-center text-sm text-slate-500 mt-7">

              Already have an account?{' '}

              <Link
                to="/login"
                className="font-bold hover:underline"
                style={{ color: PRIMARY }}
              >
                Log in
              </Link>

            </p>


            {/* BENEFITS */}

            <div
              className="mt-7 p-4 rounded-2xl"
              style={{
                backgroundColor: LIGHT,
                border: `1px solid ${BORDER}`
              }}
            >

              <div className="grid grid-cols-3 gap-2">

                <Benefit text="Discover" />

                <Benefit text="Rate" />

                <Benefit text="Review" />

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}


/* ================= INPUT COMPONENT ================= */

function InputField({
  label,
  type,
  placeholder,
  value,
  onChange
}) {
  const PRIMARY = '#410666';
  const BORDER = '#E9DDF0';

  return (
    <div>

      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl outline-none text-sm text-slate-800 placeholder-slate-400 transition-all"
        style={{
          border: `1px solid ${BORDER}`
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor =
            PRIMARY;
          e.currentTarget.style.boxShadow =
            `0 0 0 3px rgba(65,6,102,0.07)`;
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor =
            BORDER;
          e.currentTarget.style.boxShadow =
            'none';
        }}
      />

    </div>
  );
}


/* ================= FEATURE ================= */

function Feature({ title, text }) {
  return (
    <div className="flex gap-3">

      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{
          backgroundColor:
            'rgba(255,255,255,0.10)'
        }}
      >
        <CheckCircle2 className="w-4 h-4" />
      </div>

      <div>

        <p className="text-sm font-semibold">
          {title}
        </p>

        <p className="text-xs text-white/50 mt-0.5">
          {text}
        </p>

      </div>

    </div>
  );
}


/* ================= BENEFIT ================= */

function Benefit({ text }) {
  const PRIMARY = '#410666';

  return (
    <div className="flex items-center justify-center gap-1.5">

      <CheckCircle2
        className="w-3.5 h-3.5"
        style={{ color: PRIMARY }}
      />

      <span className="text-xs font-semibold text-slate-600">
        {text}
      </span>

    </div>
  );
}