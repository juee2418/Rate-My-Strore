import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import {
  Star,
  Users,
  Store,
  TrendingUp,
  Award,
  Mail
} from 'lucide-react';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stores/owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => {
        console.error('Failed to load owner dashboard:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7fc] via-white to-[#f4eef8]">
        <Navbar />

        <div className="flex flex-col items-center justify-center min-h-[70vh]">
          <div className="w-12 h-12 border-4 border-[#eadff0] border-t-[#410666] rounded-full animate-spin"></div>

          <p className="mt-4 text-gray-500 font-medium">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* ================= NO STORE ================= */

  if (!data?.store) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf7fc] via-white to-[#f4eef8]">
        <Navbar />

        <div className="max-w-2xl mx-auto px-6 py-20">
          <div className="bg-white rounded-3xl shadow-sm border border-[#eadff0] p-10 text-center">

            <div className="w-20 h-20 mx-auto rounded-2xl bg-[#f4eafa] flex items-center justify-center">
              <Store className="w-10 h-10 text-[#410666]" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-6">
              No Store Linked
            </h2>

            <p className="text-gray-500 mt-3 leading-relaxed">
              No store is linked to your account yet.
              Please contact the administrator to connect your store.
            </p>

          </div>
        </div>
      </div>
    );
  }

  const avgRating = Number(data.avgRating || 0);
  const totalRatings = data.totalRatings || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7fc] via-white to-[#f4eef8]">

      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">

          <div>

            <div className="flex items-center gap-2 text-[#410666] text-sm font-semibold mb-2">
              <Store className="w-4 h-4" />
              Store Owner Dashboard
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900">
              {data.store.name}
            </h1>

            <p className="text-gray-500 mt-2">
              Monitor your store performance and customer feedback.
            </p>

          </div>

          <div className="flex items-center gap-3 bg-white border border-[#eadff0] shadow-sm rounded-2xl px-4 py-3">

            <div className="w-10 h-10 rounded-xl bg-[#f4eafa] flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#410666]" />
            </div>

            <div>

              <p className="text-xs text-gray-400">
                Overall Performance
              </p>

              <p className="text-sm font-bold text-gray-800">
                {avgRating >= 4
                  ? 'Excellent'
                  : avgRating >= 3
                  ? 'Good'
                  : avgRating > 0
                  ? 'Needs Improvement'
                  : 'No Data Yet'}
              </p>

            </div>

          </div>

        </div>

        {/* ================= STAT CARDS ================= */}

        <div className="grid md:grid-cols-3 gap-5 mb-8">

          {/* AVERAGE RATING */}

          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#eadff0] shadow-sm p-6 hover:shadow-md transition">

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#f4eafa]"></div>

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-400">
                    Average Rating
                  </p>

                  <div className="flex items-end gap-2 mt-2">

                    <span className="text-4xl font-extrabold text-gray-900">
                      {avgRating.toFixed(1)}
                    </span>

                    <span className="text-gray-400 mb-1">
                      / 5
                    </span>

                  </div>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#f4eafa] flex items-center justify-center">
                  <Star className="w-6 h-6 text-[#410666] fill-[#410666]" />
                </div>

              </div>

              <div className="mt-4">
                <StarRating
                  value={avgRating}
                  size={18}
                />
              </div>

              <p className="text-xs text-gray-400 mt-3">
                Based on customer ratings
              </p>

            </div>

          </div>

          {/* TOTAL RATINGS */}

          <div className="relative overflow-hidden bg-white rounded-3xl border border-[#eadff0] shadow-sm p-6 hover:shadow-md transition">

            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#f4eafa]"></div>

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-gray-400">
                    Total Ratings
                  </p>

                  <p className="text-4xl font-extrabold text-gray-900 mt-2">
                    {totalRatings}
                  </p>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-[#f4eafa] flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#410666]" />
                </div>

              </div>

              <div className="flex items-center gap-2 mt-5 text-sm">

                <span className="flex items-center gap-1 text-[#410666] font-medium">
                  <TrendingUp className="w-4 h-4" />
                  Customer feedback
                </span>

              </div>

            </div>

          </div>

          {/* STATUS */}

          <div className="relative overflow-hidden bg-gradient-to-br from-[#410666] via-[#542078] to-[#6d358d] rounded-3xl shadow-sm p-6 text-white">

            <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10"></div>

            <div className="absolute -bottom-12 -left-10 w-28 h-28 rounded-full bg-white/5"></div>

            <div className="relative">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-purple-100">
                    Rating Status
                  </p>

                  <p className="text-2xl font-bold mt-2">

                    {avgRating >= 4
                      ? 'Excellent'
                      : avgRating >= 3
                      ? 'Good'
                      : avgRating > 0
                      ? 'Average'
                      : 'Waiting for ratings'}

                  </p>

                </div>

                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>

              </div>

              <p className="text-sm text-purple-100 mt-6">
                Keep providing great service to improve your rating.
              </p>

            </div>

          </div>

        </div>

        {/* ================= PERFORMANCE ================= */}

        <div className="bg-white rounded-3xl border border-[#eadff0] shadow-sm p-6 mb-8">

          <div className="flex items-center justify-between mb-6">

            <div>

              <h2 className="text-lg font-bold text-gray-800">
                Store Performance
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Your current customer satisfaction score
              </p>

            </div>

            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">

              <Star className="w-4 h-4 text-[#410666] fill-[#410666]" />

              Rating out of 5

            </div>

          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-6">

            <div className="w-full">

              <div className="flex justify-between text-sm mb-2">

                <span className="font-medium text-gray-600">
                  Customer Satisfaction
                </span>

                <span className="font-bold text-gray-800">
                  {avgRating.toFixed(1)} / 5
                </span>

              </div>

              <div className="h-3 bg-[#eee5f2] rounded-full overflow-hidden">

                <div
                  className="h-full bg-gradient-to-r from-[#410666] to-[#7b4397] rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      (avgRating / 5) * 100,
                      100
                    )}%`
                  }}
                ></div>

              </div>

            </div>

            <div className="flex-shrink-0 text-center px-6 py-3 bg-[#f7f1f9] rounded-2xl">

              <p className="text-2xl font-bold text-gray-800">
                {totalRatings}
              </p>

              <p className="text-xs text-gray-400">
                Reviews
              </p>

            </div>

          </div>

        </div>

        {/* ================= CUSTOMER FEEDBACK ================= */}

        <div className="bg-white rounded-3xl border border-[#eadff0] shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-[#eadff0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>

              <h2 className="text-lg font-bold text-gray-800">
                Customer Feedback
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                Customers who rated your store
              </p>

            </div>

            <div className="flex items-center gap-2 px-3 py-2 bg-[#f7f1f9] rounded-xl">

              <Users className="w-4 h-4 text-[#410666]" />

              <span className="text-sm font-semibold text-[#410666]">

                {totalRatings}{' '}

                {totalRatings === 1
                  ? 'Rating'
                  : 'Ratings'}

              </span>

            </div>

          </div>

          {/* NO RATINGS */}

          {data.raters.length === 0 ? (

            <div className="py-16 px-6 text-center">

              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f7f1f9] flex items-center justify-center">

                <Star className="w-8 h-8 text-[#b68ac8]" />

              </div>

              <h3 className="text-lg font-semibold text-gray-700 mt-5">
                No ratings yet
              </h3>

              <p className="text-sm text-gray-400 mt-2 max-w-sm mx-auto">
                Once customers rate your store, their feedback will appear here.
              </p>

            </div>

          ) : (

            /* RATINGS TABLE */

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-[#f7f1f9]">

                  <tr>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#410666] uppercase tracking-wide">
                      Customer
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#410666] uppercase tracking-wide">
                      Email
                    </th>

                    <th className="text-left px-6 py-4 text-xs font-semibold text-[#410666] uppercase tracking-wide">
                      Rating
                    </th>

                    <th className="text-right px-6 py-4 text-xs font-semibold text-[#410666] uppercase tracking-wide">
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {data.raters.map((r) => {

                    const initials = r.name
                      ? r.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()
                      : '?';

                    return (

                      <tr
                        key={r.id}
                        className="border-t border-[#f0e7f3] hover:bg-[#faf7fc] transition"
                      >

                        {/* CUSTOMER */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#410666] to-[#7b4397] text-white flex items-center justify-center font-bold text-sm">
                              {initials}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-700">
                                {r.name}
                              </p>

                              <p className="text-xs text-gray-400">
                                Customer
                              </p>

                            </div>

                          </div>

                        </td>

                        {/* EMAIL */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-2 text-gray-500">

                            <Mail className="w-4 h-4 text-[#8f62a5]" />

                            {r.email}

                          </div>

                        </td>

                        {/* RATING */}

                        <td className="px-6 py-4">

                          <div className="flex items-center gap-3">

                            <StarRating
                              value={r.rating}
                              size={16}
                            />

                            <span className="font-semibold text-gray-700">
                              {Number(r.rating).toFixed(1)}
                            </span>

                          </div>

                        </td>

                        {/* STATUS */}

                        <td className="px-6 py-4 text-right">

                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f7f1f9] text-[#410666] text-xs font-semibold">

                            <span className="w-1.5 h-1.5 rounded-full bg-[#410666]"></span>

                            Submitted

                          </span>

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </div>

        {/* ================= FOOTER ================= */}

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">

          <span>
            Keep delivering great experiences
          </span>

          <Star className="w-3.5 h-3.5 text-[#410666] fill-[#410666]" />

        </div>

      </main>

    </div>
  );
}