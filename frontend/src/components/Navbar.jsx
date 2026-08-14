import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Store,
  LogOut,
  LayoutDashboard,
  KeyRound,
  ChevronDown,
  ShieldCheck,
  UserRound
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const PRIMARY = '#410666';
  const LIGHT = '#F7F1FA';
  const BORDER = '#E9DDF0';

  function handleLogout() {
    setProfileOpen(false);
    logout();
    navigate('/login');
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const homeLink =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'store_owner'
        ? '/owner'
        : '/stores';

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  const roleText =
    user?.role === 'admin'
      ? 'Administrator'
      : user?.role === 'store_owner'
        ? 'Store Owner'
        : 'Customer';

  const RoleIcon =
    user?.role === 'admin'
      ? ShieldCheck
      : user?.role === 'store_owner'
        ? Store
        : UserRound;

  return (
    <nav
      className="bg-white sticky top-0 z-50 shadow-sm"
      style={{ borderBottom: `1px solid ${BORDER}` }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">

        <div className="flex items-center justify-between">

          {/* ============================= */}
          {/* LOGO */}
          {/* ============================= */}

          <Link
            to={user ? homeLink : '/login'}
            className="flex items-center gap-3 group"
          >

            {/* Logo */}

            <div className="relative flex-shrink-0">

              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-all duration-200"
                style={{
                  background: `linear-gradient(135deg, ${PRIMARY}, #6B238A)`
                }}
              >
                <Store className="w-6 h-6" />
              </div>

              <div
                className="absolute -right-1 -bottom-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                style={{ backgroundColor: PRIMARY }}
              />

            </div>

            {/* APP NAME */}

            <div className="block">

              <h1 className="text-xl font-extrabold tracking-tight leading-none whitespace-nowrap">

                <span style={{ color: PRIMARY }}>
                  Store
                </span>

                <span className="text-slate-800">
                  Rate
                </span>

              </h1>

              <p className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-wider uppercase mt-1 whitespace-nowrap">
                Rate • Review • Discover
              </p>

            </div>

          </Link>


          {/* ============================= */}
          {/* RIGHT SIDE */}
          {/* ============================= */}

          {user && (

            <div className="flex items-center gap-2 sm:gap-3">

              {/* PROFILE */}

              <div
                className="relative"
                ref={profileRef}
              >

                <button
                  type="button"
                  onClick={() =>
                    setProfileOpen(!profileOpen)
                  }
                  className="flex items-center gap-2 sm:gap-3 rounded-xl px-2 sm:px-3 py-1.5 transition-all duration-200"
                  style={{
                    backgroundColor: profileOpen
                      ? LIGHT
                      : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!profileOpen) {
                      e.currentTarget.style.backgroundColor = LIGHT;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!profileOpen) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >

                  {/* Avatar */}

                  <div
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${PRIMARY}, #74369A)`
                    }}
                  >
                    {userInitial}
                  </div>


                  {/* User Information */}

                  <div className="hidden sm:block text-left">

                    <p className="text-sm font-semibold text-slate-800 max-w-[150px] truncate">
                      {user.name}
                    </p>

                    <p
                      className="text-xs font-medium"
                      style={{ color: PRIMARY }}
                    >
                      {roleText}
                    </p>

                  </div>


                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                  />

                </button>


                {/* ============================= */}
                {/* DROPDOWN */}
                {/* ============================= */}

                {profileOpen && (

                  <div
                    className="absolute right-0 top-14 w-72 bg-white rounded-2xl shadow-xl overflow-hidden"
                    style={{ border: `1px solid ${BORDER}` }}
                  >

                    {/* Header */}

                    <div
                      className="p-5 text-white"
                      style={{
                        background: `linear-gradient(135deg, ${PRIMARY}, #672084)`
                      }}
                    >

                      <div className="flex items-center gap-3">

                        <div
                          className="w-12 h-12 rounded-full bg-white/15 border border-white/30 flex items-center justify-center text-lg font-bold"
                        >
                          {userInitial}
                        </div>

                        <div className="min-w-0">

                          <p className="font-bold truncate">
                            {user.name}
                          </p>

                          <p className="text-xs text-white/70 truncate">
                            {user.email}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Account */}

                    <div className="p-4">

                      <div
                        className="rounded-xl p-3 mb-3"
                        style={{ backgroundColor: LIGHT }}
                      >

                        <div className="flex items-center gap-3">

                          <div
                            className="w-9 h-9 rounded-lg bg-white flex items-center justify-center"
                            style={{ color: PRIMARY }}
                          >
                            <RoleIcon className="w-5 h-5" />
                          </div>

                          <div>

                            <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                              Account Type
                            </p>

                            <p className="text-sm font-semibold text-slate-700">
                              {roleText}
                            </p>

                          </div>

                        </div>

                      </div>


                      {/* Dashboard */}

                      <Link
                        to={homeLink}
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 transition"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = LIGHT;
                          e.currentTarget.style.color = PRIMARY;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '';
                        }}
                      >

                        <LayoutDashboard className="w-4 h-4" />

                        <span className="font-medium">
                          Dashboard
                        </span>

                      </Link>


                      {/* Change Password */}

                      <Link
                        to="/update-password"
                        onClick={() =>
                          setProfileOpen(false)
                        }
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-600 transition"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = LIGHT;
                          e.currentTarget.style.color = PRIMARY;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = '';
                        }}
                      >

                        <KeyRound className="w-4 h-4" />

                        <span className="font-medium">
                          Change Password
                        </span>

                      </Link>

                    </div>

                  </div>

                )}

              </div>


              {/* ============================= */}
              {/* LOGOUT */}
              {/* ============================= */}

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-semibold text-white px-3 sm:px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                style={{
                  backgroundColor: PRIMARY
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#32044F';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = PRIMARY;
                }}
              >

                <LogOut className="w-4 h-4" />

                <span className="hidden sm:inline">
                  Logout
                </span>

              </button>

            </div>

          )}

        </div>

      </div>

    </nav>
  );
}