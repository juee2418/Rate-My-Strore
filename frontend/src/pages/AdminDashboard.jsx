import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SortableHeader from '../components/SortableHeader';
import StarRating from '../components/StarRating';
import api from '../api/axios';

import {
  Users,
  Store,
  Star,
  Plus,
  X,
  ShieldCheck,
  StoreIcon,
  Trash2,
  Search,
  UserRound,
  MapPin,
  Eye,
  RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStores, setLoadingStores] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  const [tab, setTab] = useState('users');

  // Popup category
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryUsers, setCategoryUsers] = useState([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  const [filters, setFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });

  const [sort, setSort] = useState({
    sortBy: 'name',
    order: 'asc'
  });

  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  // Used for both user and store delete loading
  const [deleteLoading, setDeleteLoading] = useState(null);

  // =========================================================
  // FETCH STATS
  // =========================================================

  async function fetchStats() {
    setLoadingStats(true);

    try {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoadingStats(false);
    }
  }

  // =========================================================
  // FETCH USERS
  // =========================================================

  async function fetchUsers(customRole = '') {
    setLoadingUsers(true);

    try {
      const { data } = await api.get('/admin/users', {
        params: {
          name: filters.name,
          email: filters.email,
          address: filters.address,
          role: customRole,
          sortBy: sort.sortBy,
          order: sort.order
        }
      });

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  }

  // =========================================================
  // FETCH STORES
  // =========================================================

  async function fetchStores() {
    setLoadingStores(true);

    try {
      const { data } = await api.get('/stores', {
        params: {
          name: filters.name,
          address: filters.address,
          sortBy: sort.sortBy,
          order: sort.order
        }
      });

      setStores(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
      setStores([]);
    } finally {
      setLoadingStores(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchStats();
    fetchUsers('');
    fetchStores();
  }, []);

  // =========================================================
  // OPEN CATEGORY POPUP
  // =========================================================

  async function openCategory(category) {
    setSelectedCategory(category);
    setCategoryLoading(true);
    setCategoryUsers([]);

    try {
      const role = category === 'all' ? '' : category;

      const { data } = await api.get('/admin/users', {
        params: {
          name: filters.name,
          email: filters.email,
          address: filters.address,
          role,
          sortBy: sort.sortBy,
          order: sort.order
        }
      });

      setCategoryUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load category users:', err);
      setCategoryUsers([]);
    } finally {
      setCategoryLoading(false);
    }
  }

  // =========================================================
  // CLOSE POPUP
  // =========================================================

  function closeCategory() {
    setSelectedCategory(null);
    setCategoryUsers([]);
  }

  // =========================================================
  // SORT
  // =========================================================

  function handleSort(field) {
    const newSort = {
      sortBy: field,
      order:
        sort.sortBy === field && sort.order === 'asc'
          ? 'desc'
          : 'asc'
    };

    setSort(newSort);
  }

  // =========================================================
  // FILTER
  // =========================================================

  async function handleFilterSubmit(e) {
    e.preventDefault();

    if (tab === 'users') {
      await fetchUsers('');
    } else {
      await fetchStores();
    }

    if (selectedCategory) {
      const role =
        selectedCategory === 'all'
          ? ''
          : selectedCategory;

      try {
        const { data } = await api.get('/admin/users', {
          params: {
            name: filters.name,
            email: filters.email,
            address: filters.address,
            role,
            sortBy: sort.sortBy,
            order: sort.order
          }
        });

        setCategoryUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    }
  }

  // =========================================================
  // DELETE USER
  // =========================================================

  async function handleDeleteUser(userId, userName) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${userName}"?`
    );

    if (!confirmed) return;

    setDeleteLoading(userId);

    try {
      await api.delete(`/admin/users/${userId}`);

      alert('User deleted successfully.');

      await fetchStats();
      await fetchUsers('');

      if (selectedCategory) {
        await openCategory(selectedCategory);
      }
    } catch (err) {
      console.error('Delete user error:', err);

      alert(
        err.response?.data?.message ||
          'Failed to delete user.'
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  // =========================================================
  // DELETE STORE
  // =========================================================

  async function handleDeleteStore(storeId, storeName) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${storeName}"?`
    );

    if (!confirmed) return;

    setDeleteLoading(`store-${storeId}`);

    try {
      await api.delete(`/stores/${storeId}`);

      alert('Store deleted successfully.');

      // Refresh statistics and stores after deletion
      await fetchStats();
      await fetchStores();
    } catch (err) {
      console.error('Delete store error:', err);

      alert(
        err.response?.data?.message ||
          'Failed to delete store.'
      );
    } finally {
      setDeleteLoading(null);
    }
  }

  // =========================================================
  // CATEGORY DATA
  // =========================================================

  const categories = [
    {
      key: 'all',
      title: 'All Users',
      description: 'View all registered users',
      count: stats?.totalUsers ?? 0,
      icon: <Users className="w-6 h-6" />,
      iconClass: 'bg-[#410666]/10 text-[#410666]'
    },
    {
      key: 'admin',
      title: 'Administrators',
      description: 'System administrators',
      count:
        stats?.totalAdmins ??
        users.filter((u) => u.role === 'admin').length,
      icon: <ShieldCheck className="w-6 h-6" />,
      iconClass: 'bg-[#410666]/10 text-[#410666]'
    },
    {
      key: 'normal_user',
      title: 'Normal Users',
      description: 'Customers and reviewers',
      count:
        stats?.totalNormalUsers ??
        users.filter((u) => u.role === 'normal_user').length,
      icon: <UserRound className="w-6 h-6" />,
      iconClass: 'bg-[#410666]/10 text-[#410666]'
    },
    {
      key: 'store_owner',
      title: 'Store Owners',
      description: 'Users who manage stores',
      count:
        stats?.totalStoreOwners ??
        users.filter((u) => u.role === 'store_owner').length,
      icon: <StoreIcon className="w-6 h-6" />,
      iconClass: 'bg-[#410666]/10 text-[#410666]'
    }
  ];

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#410666]/5">

      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div className="mb-8">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-[#410666] text-white flex items-center justify-center shadow-lg shadow-[#410666]/20">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <div>

                <p className="text-xs font-bold uppercase tracking-widest text-[#410666]">
                  Administration
                </p>

                <h1 className="text-3xl font-extrabold text-slate-900">
                  Admin Dashboard
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Manage users, stores and platform activity.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => {
                fetchStats();
                fetchUsers('');
                fetchStores();
              }}
              className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#410666] hover:border-[#410666]/30 shadow-sm transition"
            >

              <RefreshCw
                className={`w-4 h-4 ${
                  loadingStats ? 'animate-spin' : ''
                }`}
              />

              Refresh

            </button>

          </div>

        </div>

        {/* ================================================= */}
        {/* STATS */}
        {/* ================================================= */}

        <div className="grid sm:grid-cols-3 gap-5 mb-8">

          <StatCard
            icon={<Users />}
            label="Total Users"
            value={stats?.totalUsers}
          />

          <StatCard
            icon={<Store />}
            label="Total Stores"
            value={stats?.totalStores}
          />

          <StatCard
            icon={<Star />}
            label="Total Ratings"
            value={stats?.totalRatings}
          />

        </div>

        {/* ================================================= */}
        {/* TABS */}
        {/* ================================================= */}

        <div className="flex items-center justify-between mb-6">

          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">

            <button
              type="button"
              onClick={() => setTab('users')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                tab === 'users'
                  ? 'bg-[#410666] text-white shadow-md'
                  : 'text-slate-500 hover:bg-[#410666]/5 hover:text-[#410666]'
              }`}
            >

              <Users className="w-4 h-4" />

              Users

            </button>

            <button
              type="button"
              onClick={() => setTab('stores')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition ${
                tab === 'stores'
                  ? 'bg-[#410666] text-white shadow-md'
                  : 'text-slate-500 hover:bg-[#410666]/5 hover:text-[#410666]'
              }`}
            >

              <Store className="w-4 h-4" />

              Stores

            </button>

          </div>

          <button
            type="button"
            onClick={() =>
              tab === 'users'
                ? setShowUserModal(true)
                : setShowStoreModal(true)
            }
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#410666] hover:bg-[#32044f] text-white text-sm font-semibold shadow-md transition"
          >

            <Plus className="w-4 h-4" />

            Add {tab === 'users' ? 'User' : 'Store'}

          </button>

        </div>

        {/* ================================================= */}
        {/* USERS */}
        {/* ================================================= */}

        {tab === 'users' && (
          <>

            {/* CATEGORY CARDS */}

            <div className="mb-8">

              <div className="flex items-center justify-between mb-4">

                <div>

                  <h2 className="text-xl font-bold text-slate-900">
                    User Management
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Click a category to view users.
                  </p>

                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">

                  <Eye className="w-4 h-4" />

                  Click to view

                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {categories.map((category) => (

                  <button
                    key={category.key}
                    type="button"
                    onClick={() =>
                      openCategory(category.key)
                    }
                    className="group text-left bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#410666]/30 transition-all duration-200"
                  >

                    <div className="flex items-start justify-between">

                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${category.iconClass} group-hover:bg-[#410666] group-hover:text-white transition`}
                      >
                        {category.icon}
                      </div>

                      <span className="text-2xl font-extrabold text-slate-800">
                        {category.count}
                      </span>

                    </div>

                    <h3 className="font-bold text-slate-800 mt-5">
                      {category.title}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-1.5 mt-4 text-xs font-semibold text-[#410666]">

                      <Eye className="w-3.5 h-3.5" />

                      View users

                    </div>

                  </button>

                ))}

              </div>

            </div>

          </>
        )}

        {/* ================================================= */}
        {/* FILTERS */}
        {/* ================================================= */}

        <form
          onSubmit={handleFilterSubmit}
          className="bg-white border border-slate-200 rounded-2xl p-5 mb-6 shadow-sm"
        >

          <div className="flex items-center gap-2 mb-4">

            <Search className="w-4 h-4 text-[#410666]" />

            <h3 className="font-semibold text-slate-800">
              Search & Filters
            </h3>

          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">

            <input
              className="input-field"
              placeholder="Filter by name"
              value={filters.name}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  name: e.target.value
                })
              }
            />

            {tab === 'users' && (
              <input
                className="input-field"
                placeholder="Filter by email"
                value={filters.email}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    email: e.target.value
                  })
                }
              />
            )}

            <input
              className="input-field"
              placeholder="Filter by address"
              value={filters.address}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  address: e.target.value
                })
              }
            />

            {tab === 'users' && (
              <select
                className="input-field"
                value={filters.role}
                onChange={(e) =>
                  setFilters({
                    ...filters,
                    role: e.target.value
                  })
                }
              >

                <option value="">
                  All roles
                </option>

                <option value="admin">
                  Administrator
                </option>

                <option value="normal_user">
                  Normal User
                </option>

                <option value="store_owner">
                  Store Owner
                </option>

              </select>
            )}

          </div>

          <button
            type="submit"
            className="mt-4 px-5 py-2.5 rounded-xl bg-[#410666] hover:bg-[#32044f] text-white text-sm font-semibold transition"
          >
            Apply Filters
          </button>

        </form>

        {/* ================================================= */}
        {/* STORE TABLE */}
        {/* ================================================= */}

        {tab === 'stores' && (

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">

            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">

              <div>

                <h3 className="font-bold text-slate-800">
                  Store Management
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  Manage registered stores and ratings.
                </p>

              </div>

              <span className="px-3 py-1 rounded-full bg-[#410666]/10 text-[#410666] text-xs font-semibold">
                {stores.length} Stores
              </span>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-sm">

                <thead className="bg-[#410666]/5">

                  <tr>

                    <SortableHeader
                      label="Name"
                      field="name"
                      sortBy={sort.sortBy}
                      order={sort.order}
                      onSort={handleSort}
                    />

                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Email
                    </th>

                    <SortableHeader
                      label="Address"
                      field="address"
                      sortBy={sort.sortBy}
                      order={sort.order}
                      onSort={handleSort}
                    />

                    <SortableHeader
                      label="Rating"
                      field="avgRating"
                      sortBy={sort.sortBy}
                      order={sort.order}
                      onSort={handleSort}
                    />

                    {/* NEW ACTION COLUMN */}

                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loadingStores ? (

                    <LoadingRow colSpan={5} />

                  ) : stores.length === 0 ? (

                    <tr>

                      <td
                        colSpan={5}
                        className="text-center py-12 text-slate-400"
                      >
                        No stores found.
                      </td>

                    </tr>

                  ) : (

                    stores.map((store) => (

                      <tr
                        key={store.id}
                        className="border-t border-slate-100 hover:bg-[#410666]/5 transition"
                      >

                        {/* NAME */}

                        <td className="px-4 py-3 font-semibold text-slate-700">
                          {store.name}
                        </td>

                        {/* EMAIL */}

                        <td className="px-4 py-3 text-slate-500">
                          {store.email || '—'}
                        </td>

                        {/* ADDRESS */}

                        <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                          {store.address || '—'}
                        </td>

                        {/* RATING */}

                        <td className="px-4 py-3">

                          <div className="flex items-center gap-2">

                            <StarRating
                              value={store.avgRating || 0}
                              size={14}
                            />

                            <span className="text-slate-500">

                              {store.avgRating
                                ? Number(
                                    store.avgRating
                                  ).toFixed(1)
                                : '—'}

                            </span>

                          </div>

                        </td>

                        {/* DELETE ACTION */}

                        <td className="px-4 py-3">

                          <button
                            type="button"
                            disabled={
                              deleteLoading ===
                              `store-${store.id}`
                            }
                            onClick={() =>
                              handleDeleteStore(
                                store.id,
                                store.name
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold transition disabled:opacity-50"
                          >

                            <Trash2 className="w-3.5 h-3.5" />

                            {deleteLoading ===
                            `store-${store.id}`
                              ? 'Deleting...'
                              : 'Delete'}

                          </button>

                        </td>

                      </tr>

                    ))

                  )}

                </tbody>

              </table>

            </div>

          </div>

        )}

      </main>

      {/* ================================================= */}
      {/* CATEGORY USER POPUP */}
      {/* ================================================= */}

      {selectedCategory && (

        <CategoryModal
          category={selectedCategory}
          users={categoryUsers}
          loading={categoryLoading}
          onClose={closeCategory}
          onDelete={handleDeleteUser}
          deleteLoading={deleteLoading}
        />

      )}

      {/* ================================================= */}
      {/* ADD USER MODAL */}
      {/* ================================================= */}

      {showUserModal && (

        <AddUserModal
          onClose={() =>
            setShowUserModal(false)
          }
          onCreated={async () => {
            setShowUserModal(false);
            await fetchStats();
            await fetchUsers('');
          }}
        />

      )}

      {/* ================================================= */}
      {/* ADD STORE MODAL */}
      {/* ================================================= */}

      {showStoreModal && (

        <AddStoreModal
          onClose={() =>
            setShowStoreModal(false)
          }
          onCreated={async () => {
            setShowStoreModal(false);
            await fetchStats();
            await fetchStores();
          }}
        />

      )}

    </div>
  );
}


/* ========================================================= */
/* STAT CARD */
/* ========================================================= */

function StatCard({ icon, label, value }) {

  return (

    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition">

      <div className="w-12 h-12 rounded-xl bg-[#410666]/10 text-[#410666] flex items-center justify-center">
        {icon}
      </div>

      <div>

        <p className="text-sm text-slate-400">
          {label}
        </p>

        <p className="text-2xl font-bold text-slate-800">
          {value ?? '—'}
        </p>

      </div>

    </div>

  );
}


/* ========================================================= */
/* CATEGORY MODAL */
/* ========================================================= */

function CategoryModal({
  category,
  users,
  loading,
  onClose,
  onDelete,
  deleteLoading
}) {

  const categoryInfo = {

    all: {
      title: 'All Users',
      description: 'All registered users',
      icon: <Users className="w-6 h-6" />
    },

    admin: {
      title: 'Administrators',
      description: 'System administrator accounts',
      icon: <ShieldCheck className="w-6 h-6" />
    },

    normal_user: {
      title: 'Normal Users',
      description: 'Customers and reviewers',
      icon: <UserRound className="w-6 h-6" />
    },

    store_owner: {
      title: 'Store Owners',
      description: 'Users who manage stores',
      icon: <StoreIcon className="w-6 h-6" />
    }

  };

  const info = categoryInfo[category];

  return (

    <div
      className="fixed inset-0 z-[100] bg-slate-950/50 backdrop-blur-sm flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="bg-[#410666] px-6 py-5 text-white">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-4">

              <div className="w-11 h-11 rounded-xl bg-white/15 flex items-center justify-center">
                {info.icon}
              </div>

              <div>

                <h2 className="text-xl font-bold">
                  {info.title}
                </h2>

                <p className="text-xs text-white/70 mt-1">
                  {info.description}
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>

          </div>

        </div>

        {/* COUNT */}

        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">

          <div>

            <p className="text-xs uppercase tracking-wider font-bold text-slate-400">
              Users Found
            </p>

            <p className="text-2xl font-extrabold text-slate-800">
              {loading ? '...' : users.length}
            </p>

          </div>

          <div className="px-3 py-1.5 rounded-full bg-[#410666]/10 text-[#410666] text-xs font-bold">
            {info.title}
          </div>

        </div>

        {/* CONTENT */}

        <div className="max-h-[60vh] overflow-y-auto">

          {loading ? (

            <div className="flex flex-col items-center justify-center py-20">

              <div className="w-10 h-10 border-4 border-[#410666]/20 border-t-[#410666] rounded-full animate-spin" />

              <p className="text-sm text-slate-400 mt-4">
                Loading users...
              </p>

            </div>

          ) : users.length === 0 ? (

            <div className="py-20 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <Users className="w-7 h-7" />
              </div>

              <h3 className="font-bold text-slate-700 mt-4">
                No users found
              </h3>

              <p className="text-sm text-slate-400 mt-1">
                There are no users in this category.
              </p>

            </div>

          ) : (

            <div className="p-5">

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">

                <table className="w-full text-sm">

                  <thead className="bg-[#410666]/5">

                    <tr>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        ID
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        User
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Email
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Address
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Role
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Rating
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {users.map((user) => (

                      <tr
                        key={user.id}
                        className="border-t border-slate-100 hover:bg-[#410666]/5 transition"
                      >

                        <td className="px-4 py-4 text-slate-400 font-medium">
                          #{user.id}
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-3">

                            <div className="w-9 h-9 rounded-full bg-[#410666] text-white flex items-center justify-center font-bold text-xs">

                              {user.name
                                ?.charAt(0)
                                ?.toUpperCase() || 'U'}

                            </div>

                            <div>

                              <p className="font-semibold text-slate-700">
                                {user.name}
                              </p>

                              <p className="text-xs text-slate-400">
                                User account
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-4 py-4 text-slate-500">
                          {user.email || '—'}
                        </td>

                        <td className="px-4 py-4">

                          <div className="flex items-center gap-1.5 text-slate-500 max-w-[180px]">

                            <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-[#410666]" />

                            <span className="truncate">
                              {user.address || '—'}
                            </span>

                          </div>

                        </td>

                        <td className="px-4 py-4">
                          <RoleBadge role={user.role} />
                        </td>

                        <td className="px-4 py-4 text-slate-500">

                          {user.role === 'store_owner' &&
                          user.storeRating ? (
                            Number(
                              user.storeRating
                            ).toFixed(1)
                          ) : (
                            '—'
                          )}

                        </td>

                        <td className="px-4 py-4">

                          <button
                            type="button"
                            disabled={
                              deleteLoading === user.id
                            }
                            onClick={() =>
                              onDelete(
                                user.id,
                                user.name
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold transition disabled:opacity-50"
                          >

                            <Trash2 className="w-3.5 h-3.5" />

                            {deleteLoading === user.id
                              ? 'Deleting...'
                              : 'Delete'}

                          </button>

                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

        {/* FOOTER */}

        <div className="px-6 py-4 border-t border-slate-100 flex justify-end">

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold transition"
          >
            Close
          </button>

        </div>

      </div>

    </div>

  );
}


/* ========================================================= */
/* ROLE BADGE */
/* ========================================================= */

function RoleBadge({ role }) {

  const styles = {
    admin:
      'bg-[#410666]/10 text-[#410666] border-[#410666]/20',

    normal_user:
      'bg-sky-50 text-sky-700 border-sky-200',

    store_owner:
      'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  const labels = {
    admin: 'Administrator',
    normal_user: 'Normal User',
    store_owner: 'Store Owner'
  };

  return (

    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
        styles[role] ||
        'bg-slate-100 text-slate-600 border-slate-200'
      }`}
    >

      {labels[role] ||
        role?.replace('_', ' ') ||
        'Unknown'}

    </span>

  );
}


/* ========================================================= */
/* LOADING ROW */
/* ========================================================= */

function LoadingRow({ colSpan }) {

  return (

    <tr>

      <td colSpan={colSpan}>

        <div className="flex flex-col items-center justify-center py-12">

          <div className="w-8 h-8 border-4 border-[#410666]/20 border-t-[#410666] rounded-full animate-spin" />

          <p className="text-sm text-slate-400 mt-3">
            Loading...
          </p>

        </div>

      </td>

    </tr>

  );
}


/* ========================================================= */
/* ADD USER MODAL */
/* ========================================================= */

function AddUserModal({ onClose, onCreated }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'normal_user'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setError('');

    const nameLength =
      form.name.trim().length;

    if (
      nameLength < 10 ||
      nameLength > 60
    ) {
      setError(
        'Name must be between 10 and 60 characters.'
      );
      return;
    }

    setLoading(true);

    try {

      await api.post('/admin/users', {
        ...form,
        name: form.name.trim()
      });

      onCreated();

    } catch (err) {

      setError(
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.data?.message ||
        'Failed to create user.'
      );

    } finally {
      setLoading(false);
    }
  }

  return (

    <Modal
      title="Add New User"
      onClose={onClose}
    >

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        <input
          type="text"
          className="input-field"
          placeholder="Full name (10-60 characters)"
          required
          minLength={10}
          maxLength={60}
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          type="email"
          className="input-field"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <textarea
          className="input-field"
          placeholder="Address"
          rows={2}
          maxLength={400}
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value
            })
          }
        />

        <input
          type="password"
          className="input-field"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value
            })
          }
        />

        <select
          className="input-field"
          value={form.role}
          onChange={(e) =>
            setForm({
              ...form,
              role: e.target.value
            })
          }
        >

          <option value="normal_user">
            Normal User
          </option>

          <option value="admin">
            System Administrator
          </option>

          <option value="store_owner">
            Store Owner
          </option>

        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#410666] hover:bg-[#32044f] disabled:opacity-60 text-white font-semibold shadow-md transition"
        >

          {loading
            ? 'Creating...'
            : 'Create User'}

        </button>

      </form>

    </Modal>

  );
}


/* ========================================================= */
/* ADD STORE MODAL */
/* ========================================================= */

function AddStoreModal({ onClose, onCreated }) {

  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    owner_id: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {

    e.preventDefault();

    setError('');
    setLoading(true);

    try {

      await api.post('/stores', {
        ...form,
        owner_id: form.owner_id || null
      });

      onCreated();

    } catch (err) {

      setError(
        err.response?.data?.message ||
        'Failed to create store.'
      );

    } finally {
      setLoading(false);
    }
  }

  return (

    <Modal
      title="Add New Store"
      onClose={onClose}
    >

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        <input
          className="input-field"
          placeholder="Store name"
          required
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value
            })
          }
        />

        <input
          type="email"
          className="input-field"
          placeholder="Store email (optional)"
          value={form.email}
          onChange={(e) =>
            setForm({
              ...form,
              email: e.target.value
            })
          }
        />

        <textarea
          className="input-field"
          placeholder="Address"
          rows={2}
          maxLength={400}
          value={form.address}
          onChange={(e) =>
            setForm({
              ...form,
              address: e.target.value
            })
          }
        />

        <input
          type="number"
          className="input-field"
          placeholder="Owner's user ID (optional)"
          value={form.owner_id}
          onChange={(e) =>
            setForm({
              ...form,
              owner_id: e.target.value
            })
          }
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-[#410666] hover:bg-[#32044f] disabled:opacity-60 text-white font-semibold shadow-md transition"
        >

          {loading
            ? 'Creating...'
            : 'Create Store'}

        </button>

      </form>

    </Modal>

  );
}


/* ========================================================= */
/* GENERIC MODAL */
/* ========================================================= */

function Modal({
  title,
  onClose,
  children
}) {

  return (

    <div
      className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm flex items-center justify-center z-[110] px-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >

      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative p-6">

        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:bg-[#410666]/10 hover:text-[#410666] transition"
        >

          <X className="w-5 h-5" />

        </button>

        <div className="flex items-center gap-3 mb-5">

          <div className="p-2.5 rounded-xl bg-[#410666] text-white">

            <Plus className="w-5 h-5" />

          </div>

          <h2 className="text-lg font-bold text-slate-800">
            {title}
          </h2>

        </div>

        {children}

      </div>

    </div>

  );
}