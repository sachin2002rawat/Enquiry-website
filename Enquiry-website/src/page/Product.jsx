import React, { useState, useMemo } from "react";
import ProductNavbar from "../components/ProductNavbar";
import ProductBelowNavbar from "../components/Product/ProductBelowNavbar";
import ProductSearch from "../components/Product/ProductSearch";
import CategoryFilter from "../components/Product/CategoryFilter";
import ProductToolbar from "../components/Product/ProductToolbar";
import ProductGrid from "../components/Product/ProductGrid";
import WhatsAppButton from "../components/Product/WhatsAppButton";
import productsData from "../ProductsData.json";
import Footer from "../components/Footer";

// Categories definitions matching items in ProductsData.json
const CATEGORIES_CONFIG = [
  { id: 'all_products', name: 'All Products', key: 'ALL' },
  { id: 'edible_oils', name: 'Edible Oils', key: 'EDIBLE OILS' },
  { id: 'mix_masala', name: 'Mix Masala', key: 'MIX MASALA' },
  { id: 'soya_chunks', name: 'Soya Chunks', key: 'SOYA CHUNKS' },
  { id: 'pure_spices', name: 'Pure Spices', key: 'PURE SPICES' },
  { id: 'whole_spices', name: 'Whole Spices', key: 'WHOLE SPICES' },
  { id: 'pulses', name: 'Pulses', key: 'PULSES' },
  { id: 'rice', name: 'Rice', key: 'RICE' },
];

/**
 * Product Page Component
 * Connects ProductSearch, CategoryFilter, ProductToolbar, and ProductGrid 
 * using real dynamic data from ProductsData.json.
 */
const Product = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategories, setActiveCategories] = useState(['all_products']);
  const [sortBy, setSortBy] = useState('Default Sorting');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 12; // 12 cards shown per page (4 rows of 3 grid cards)

  // 1. Calculate dynamic category counts directly from ProductsData.json
  const categoriesWithCounts = useMemo(() => {
    return CATEGORIES_CONFIG.map((cat) => {
      let count = 0;
      if (cat.id === 'all_products') {
        count = productsData.length;
      } else {
        count = productsData.filter(
          (item) => (item.category || '').toUpperCase() === cat.key
        ).length;
      }
      return {
        ...cat,
        count,
        checked: activeCategories.includes(cat.id),
      };
    });
  }, [activeCategories]);

  // 2. Filter & Sort products based on search term, active categories, and sort choice
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Filter by Category
    const isAllSelected = activeCategories.includes('all_products') || activeCategories.length === 0;
    if (!isAllSelected) {
      const selectedKeys = CATEGORIES_CONFIG
        .filter((cat) => activeCategories.includes(cat.id))
        .map((cat) => cat.key);

      result = result.filter((item) =>
        selectedKeys.includes((item.category || '').toUpperCase())
      );
    }

    // Filter by Search Query
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase().trim();
      result = result.filter((item) =>
        (item.name || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query)
      );
    }

    // Apply Sorting
    if (sortBy === 'Name: A to Z') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'Name: Z to A') {
      result.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'Category') {
      result.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    } else if (sortBy === 'Latest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return result;
  }, [searchTerm, activeCategories, sortBy]);

  // 3. Pagination calculation
  const totalProductsCount = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalProductsCount / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const startIndex = totalProductsCount === 0 ? 0 : (safeCurrentPage - 1) * ITEMS_PER_PAGE + 1;
  const endIndex = Math.min(safeCurrentPage * ITEMS_PER_PAGE, totalProductsCount);

  const currentProductsPage = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, safeCurrentPage]);

  // Handlers
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // reset to page 1 on search
  };

  const handleToggleCategory = (catId) => {
    setCurrentPage(1); // reset to page 1 on filter change
    if (catId === 'all_products') {
      setActiveCategories(['all_products']);
    } else {
      setActiveCategories((prev) => {
        let updated;
        if (prev.includes(catId)) {
          updated = prev.filter((id) => id !== catId && id !== 'all_products');
        } else {
          updated = [...prev.filter((id) => id !== 'all_products'), catId];
        }

        if (updated.length === 0) {
          return ['all_products'];
        }
        return updated;
      });
    }
  };

  const handleClearFilters = () => {
    setActiveCategories(['all_products']);
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="product-page-wrapper">
      {/* 1. Top Navbar */}
      <ProductNavbar />

      {/* 2. Banner section directly below Navbar */}
      <ProductBelowNavbar />

      {/* 3. Main Product Collection Content Layout */}
      <main className="product-main-container">
        <div className="product-layout-grid">
          
          {/* Left Sidebar */}
          <aside className="product-sidebar">
            <ProductSearch 
              searchTerm={searchTerm} 
              onSearch={handleSearchChange} 
            />
            <CategoryFilter 
              categories={categoriesWithCounts} 
              onToggleCategory={handleToggleCategory} 
              onClearFilters={handleClearFilters} 
            />
          </aside>

          {/* Right Content Area */}
          <section className="product-content-area">
            <ProductToolbar 
              startIndex={startIndex}
              endIndex={endIndex}
              totalProducts={totalProductsCount}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewChange={setViewMode}
            />
            <ProductGrid 
              products={currentProductsPage}
              viewMode={viewMode}
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </section>

        </div>
      </main>

      {/* 4. Sticky Floating WhatsApp Button */}
      <WhatsAppButton />
      <Footer/>
    </div>
  );
};

export default Product;
