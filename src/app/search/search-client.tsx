'use client';
import { Suspense } from 'react';
import Header from '@/components/header';
import type { MongolMovie } from '@/lib/types';
import { CategoryChips } from './CategoryChips';
import { SearchEmptyPrompt, SearchNoResults } from './EmptyStates';
import { ResultsGrid } from './ResultsGrid';
import { SearchBar } from './SearchBar';
import { useSearch } from './useSearch';

function SearchContent({ movies }: { movies: MongolMovie[] }) {
  const { query, setQuery, activeCat, setActiveCat, results, hasFilter } = useSearch(movies);

  return (
    <div style={{ minHeight: '100vh', background: '#0b0e1a', color: '#fff', paddingTop: '62px' }}>
      <Header />

      <div style={{ padding: '24px 4% 80px' }}>
        {/* Search bar */}
        <SearchBar
          query={query}
          onChange={(value) => {
            setQuery(value);
            setActiveCat(null);
          }}
          onClear={() => setQuery('')}
        />

        {/* Category chips */}
        {!query && (
          <CategoryChips
            activeCat={activeCat}
            onToggle={(catKey) => setActiveCat(activeCat === catKey ? null : catKey)}
          />
        )}

        {/* Result count */}
        {hasFilter && (
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)', marginBottom: '16px' }}>
            {results.length} үр дүн
          </p>
        )}

        {/* Empty state */}
        {!hasFilter && (
          <SearchEmptyPrompt />
        )}

        {/* No results */}
        {hasFilter && results.length === 0 && (
          <SearchNoResults query={query} />
        )}

        {/* Results grid */}
        {results.length > 0 && <ResultsGrid results={results} />}
      </div>
    </div>
  );
}

export default function SearchClient({ movies }: { movies: MongolMovie[] }) {
  return (
    <Suspense>
      <SearchContent movies={movies} />
    </Suspense>
  );
}

