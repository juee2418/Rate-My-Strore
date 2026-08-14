import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StarRating from '../components/StarRating';
import api from '../api/axios';
import {
  Search,
  MapPin,
  Store,
  Star,
  Sparkles
} from 'lucide-react';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({
    name: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function fetchStores() {
    setLoading(true);

    try {
      const { data } = await api.get('/stores', {
        params: search
      });

      setStores(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearchSubmit(e) {
    e.preventDefault();
    fetchStores();
  }

  async function handleRate(storeId, rating) {
    setSavingId(storeId);

    try {
      await api.post(`/ratings/${storeId}`, {
        rating
      });

      setStores((prev) =>
        prev.map((s) =>
          s.id === storeId
            ? { ...s, myRating: rating }
            : s
        )
      );

      fetchStores();
    } catch (err) {
      alert(
        err.response?.data?.message ||
          'Failed to submit rating'
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf7fc] via-white to-[#f3edf7]">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* ================= HEADER ================= */}

        <div className="mb-8">

          <div className="flex items-center gap-2 mb-2">

            <div className="w-9 h-9 rounded-xl bg-[#410666] flex items-center justify-center shadow-sm">
              <Store className="w-5 h-5 text-white" />
            </div>

            <span className="text-sm font-semibold text-[#410666]">
              Store Discovery
            </span>

          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Explore Stores
          </h1>

          <p className="text-slate-500 mt-2">
            Find stores, check customer ratings, and share your experience.
          </p>

        </div>


        {/* ================= SEARCH BOX ================= */}

        <div className="bg-white border border-[#eadff0] rounded-3xl p-4 sm:p-5 shadow-sm mb-9">

          <form
            onSubmit={handleSearchSubmit}
            className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3"
          >

            {/* STORE NAME */}

            <div className="relative">

              <Search
                className="w-5 h-5 text-[#410666] absolute left-4 top-1/2 -translate-y-1/2"
              />

              <input
                type="text"
                placeholder="Search by store name"
                value={search.name}
                onChange={(e) =>
                  setSearch({
                    ...search,
                    name: e.target.value
                  })
                }
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#410666] focus:ring-4 focus:ring-[#410666]/10"
              />

            </div>


            {/* ADDRESS */}

            <div className="relative">

              <MapPin
                className="w-5 h-5 text-[#410666] absolute left-4 top-1/2 -translate-y-1/2"
              />

              <input
                type="text"
                placeholder="Search by address"
                value={search.address}
                onChange={(e) =>
                  setSearch({
                    ...search,
                    address: e.target.value
                  })
                }
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 outline-none transition focus:bg-white focus:border-[#410666] focus:ring-4 focus:ring-[#410666]/10"
              />

            </div>


            {/* SEARCH BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="h-12 px-7 rounded-xl bg-[#410666] hover:bg-[#350452] text-white font-semibold flex items-center justify-center gap-2 shadow-md shadow-[#410666]/20 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60"
            >

              <Search className="w-4 h-4" />

              Search

            </button>

          </form>

        </div>


        {/* ================= STORE COUNT ================= */}

        {!loading && stores.length > 0 && (

          <div className="flex items-center justify-between mb-5">

            <div>

              <h2 className="text-lg font-bold text-slate-800">
                Available Stores
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                {stores.length}{' '}
                {stores.length === 1
                  ? 'store'
                  : 'stores'}{' '}
                found
              </p>

            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-[#410666]/5 text-[#410666] text-xs font-semibold">

              <Sparkles className="w-4 h-4" />

              Rate & Review

            </div>

          </div>

        )}


        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="bg-white rounded-3xl border border-slate-100 p-6 animate-pulse"
              >

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-12 h-12 rounded-2xl bg-slate-100" />

                  <div className="flex-1">

                    <div className="h-4 bg-slate-100 rounded w-3/4 mb-2" />

                    <div className="h-3 bg-slate-100 rounded w-1/2" />

                  </div>

                </div>

                <div className="h-3 bg-slate-100 rounded w-full mb-3" />

                <div className="h-3 bg-slate-100 rounded w-2/3" />

              </div>

            ))}

          </div>

        ) : stores.length === 0 ? (

          /* ================= NO STORES ================= */

          <div className="bg-white border border-[#eadff0] rounded-3xl shadow-sm py-16 px-6 text-center">

            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#410666]/10 flex items-center justify-center">

              <Store className="w-8 h-8 text-[#410666]" />

            </div>

            <h3 className="text-xl font-bold text-slate-800 mt-5">
              No stores found
            </h3>

            <p className="text-sm text-slate-400 mt-2 max-w-md mx-auto">
              Try searching with a different store name or address.
            </p>

          </div>

        ) : (

          /* ================= STORE CARDS ================= */

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {stores.map((store) => {

              const rating =
                Number(store.avgRating || 0);

              const initials =
                store.name
                  ?.split(' ')
                  .map((word) => word[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'S';

              return (

                <div
                  key={store.id}
                  className="group bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-xl hover:shadow-[#410666]/10 hover:border-[#410666]/20 transition-all duration-300 hover:-translate-y-1"
                >

                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-3">

                    <div className="flex items-center gap-3 min-w-0">

                      <div className="w-12 h-12 flex-shrink-0 rounded-2xl bg-gradient-to-br from-[#410666] to-[#6b1b8d] text-white flex items-center justify-center font-bold text-sm shadow-md shadow-[#410666]/20">

                        {initials}

                      </div>

                      <div className="min-w-0">

                        <h3 className="font-bold text-lg text-slate-800 truncate">
                          {store.name}
                        </h3>

                        <div className="flex items-start gap-1 mt-1">

                          <MapPin className="w-3.5 h-3.5 text-[#410666] mt-0.5 flex-shrink-0" />

                          <p className="text-xs text-slate-400 line-clamp-2">
                            {store.address ||
                              'No address listed'}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>


                  {/* DIVIDER */}

                  <div className="border-t border-slate-100 my-5" />


                  {/* OVERALL RATING */}

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="text-xs text-slate-400 font-medium mb-2">
                        Overall Rating
                      </p>

                      <div className="flex items-center gap-2">

                        <StarRating
                          value={rating}
                          size={16}
                        />

                        <span className="text-sm font-bold text-slate-700">

                          {rating
                            ? rating.toFixed(1)
                            : '—'}

                        </span>

                      </div>

                    </div>


                    <div className="w-10 h-10 rounded-xl bg-[#410666]/5 flex items-center justify-center">

                      <Star
                        className="w-5 h-5 text-[#410666]"
                        fill="currentColor"
                      />

                    </div>

                  </div>


                  {/* RATE SECTION */}

                  <div className="mt-5 bg-[#faf7fc] border border-[#eee4f2] rounded-2xl p-4">

                    <div className="flex items-center justify-between mb-2">

                      <p className="text-xs font-semibold text-slate-600">

                        {store.myRating
                          ? 'Your rating'
                          : 'Rate this store'}

                      </p>

                      {store.myRating && (

                        <span className="text-[10px] font-semibold text-[#410666] bg-[#410666]/10 px-2 py-1 rounded-full">

                          Tap to change

                        </span>

                      )}

                    </div>


                    <StarRating
                      value={store.myRating || 0}
                      interactive
                      size={22}
                      onChange={(val) =>
                        handleRate(store.id, val)
                      }
                    />


                    {savingId === store.id && (

                      <div className="flex items-center gap-2 mt-2">

                        <div className="w-3 h-3 border-2 border-[#410666]/20 border-t-[#410666] rounded-full animate-spin" />

                        <p className="text-xs text-[#410666] font-medium">
                          Saving your rating...
                        </p>

                      </div>

                    )}

                  </div>


                  {/* FOOTER */}

                  <div className="flex items-center gap-2 mt-4 text-[11px] text-slate-400">

                    <div className="w-1.5 h-1.5 rounded-full bg-[#410666]" />

                    Help others choose with your rating

                  </div>

                </div>

              );
            })}

          </div>

        )}


        {/* ================= FOOTER ================= */}

        {!loading && stores.length > 0 && (

          <div className="flex justify-center items-center gap-2 mt-10 text-xs text-slate-400">

            <Star
              className="w-3.5 h-3.5 text-[#410666]"
              fill="currentColor"
            />

            Your feedback helps other customers make better decisions.

          </div>

        )}

      </main>

    </div>
  );
}