'use client';

import { useCallback, useState } from 'react';
import { ListingFeedConfig, ListingStatus } from '@/lib/types';
import { LISTING_STATUS_LABELS } from '@/lib/listings';
import { Check, X } from 'lucide-react';

interface ListingFeedSettingsProps {
  name: string;
  config: ListingFeedConfig;
  onNameChange: (name: string) => void;
  onConfigChange: (config: ListingFeedConfig) => void;
  distinctValues: {
    cities: string[];
    neighborhoods: string[];
    propertyTypes: string[];
    statuses: string[];
  };
}

function ChipInput({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
}) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = options.filter(
    (o) =>
      o.toLowerCase().includes(query.toLowerCase()) && !selected.includes(o)
  );

  const add = (value: string) => {
    onChange([...selected, value]);
    setQuery('');
    setOpen(false);
  };

  const remove = (value: string) => {
    onChange(selected.filter((v) => v !== value));
  };

  return (
    <div>
      <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
        {label}
      </label>
      <div className="flex flex-wrap gap-1.5">
        {selected.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded-md bg-[#F5F5F3] px-2 py-1 text-[12px] text-black"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="text-[#888C99] hover:text-black"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="relative mt-1.5">
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          placeholder={`Search ${label.toLowerCase()}...`}
          className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
        />
        {open && filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-40 overflow-y-auto rounded-lg border border-[#EBEBEB] bg-white shadow-lg">
            {filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => add(opt)}
                className="flex w-full items-center px-3 py-2 text-left text-[13px] text-black hover:bg-[#F5F5F3]"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ALL_STATUSES: ListingStatus[] = ['for_sale', 'pending', 'sold'];

export function ListingFeedSettings({
  name,
  config,
  onNameChange,
  onConfigChange,
  distinctValues,
}: ListingFeedSettingsProps) {
  const update = useCallback(
    (partial: Partial<ListingFeedConfig>) => {
      onConfigChange({ ...config, ...partial });
    },
    [config, onConfigChange]
  );

  const updateFilters = useCallback(
    (partial: Partial<ListingFeedConfig['filters']>) => {
      onConfigChange({
        ...config,
        filters: { ...config.filters, ...partial },
      });
    },
    [config, onConfigChange]
  );

  const toggleStatus = (status: ListingStatus) => {
    const current = config.filters.statuses;
    if (current.includes(status)) {
      updateFilters({ statuses: current.filter((s) => s !== status) });
    } else {
      updateFilters({ statuses: [...current, status] });
    }
  };

  return (
    <div className="space-y-6">
      {/* Name */}
      <div>
        <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
          Feed Name
        </label>
        <input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="e.g. Active Listings"
          className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
        />
      </div>

      {/* Layout */}
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-[#CCCCCC]">
          Layout
        </p>
        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
            Columns
          </label>
          <div className="flex gap-1.5">
            {([1, 2, 3] as const).map((col) => (
              <button
                key={col}
                type="button"
                onClick={() => update({ columns: col })}
                className={`flex h-[34px] flex-1 items-center justify-center rounded-lg text-[13px] transition-colors ${
                  config.columns === col
                    ? 'bg-black text-white'
                    : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                }`}
              >
                {col} Col{col > 1 ? 's' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
            Items Per Page
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              max={100}
              value={config.itemsPerPage === 'unlimited' ? '' : config.itemsPerPage}
              disabled={config.itemsPerPage === 'unlimited'}
              onChange={(e) =>
                update({
                  itemsPerPage: parseInt(e.target.value, 10) || 9,
                })
              }
              placeholder="9"
              className="h-[34px] w-20 rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07] disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() =>
                update({
                  itemsPerPage:
                    config.itemsPerPage === 'unlimited' ? 9 : 'unlimited',
                })
              }
              className={`flex h-[34px] items-center gap-1.5 rounded-lg px-3 text-[13px] transition-colors ${
                config.itemsPerPage === 'unlimited'
                  ? 'bg-black text-white'
                  : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
              }`}
            >
              {config.itemsPerPage === 'unlimited' && (
                <Check className="h-3 w-3" />
              )}
              Unlimited
            </button>
          </div>
        </div>

        {config.itemsPerPage !== 'unlimited' && (
          <div className="mt-3">
            <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
              Pagination
            </label>
            <div className="flex gap-1.5">
              {(
                [
                  { value: 'pagination', label: 'Page Numbers' },
                  { value: 'load_more', label: 'Load More' },
                  { value: 'none', label: 'None' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update({ paginationType: opt.value })}
                  className={`flex h-[34px] flex-1 items-center justify-center rounded-lg text-[13px] transition-colors ${
                    config.paginationType === opt.value
                      ? 'bg-black text-white'
                      : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-[#CCCCCC]">
          Filters
        </p>

        <div>
          <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
            Status
          </label>
          <div className="flex flex-wrap gap-1.5">
            {ALL_STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => toggleStatus(status)}
                className={`flex h-[30px] items-center gap-1.5 rounded-lg px-3 text-[13px] transition-colors ${
                  config.filters.statuses.includes(status)
                    ? 'bg-black text-white'
                    : 'border border-[#EBEBEB] bg-white text-[#888C99] hover:bg-[#F5F5F3] hover:text-black'
                }`}
              >
                {config.filters.statuses.includes(status) && (
                  <Check className="h-3 w-3" />
                )}
                {LISTING_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
          {config.filters.statuses.length === 0 && (
            <p className="mt-1 text-[11px] text-[#CCCCCC]">
              No filter = show all statuses
            </p>
          )}
        </div>

        <div className="mt-3">
          <ChipInput
            label="City"
            options={distinctValues.cities}
            selected={config.filters.cities}
            onChange={(cities) => updateFilters({ cities })}
          />
        </div>

        <div className="mt-3">
          <ChipInput
            label="Neighborhood"
            options={distinctValues.neighborhoods}
            selected={config.filters.neighborhoods}
            onChange={(neighborhoods) => updateFilters({ neighborhoods })}
          />
        </div>

        <div className="mt-3">
          <ChipInput
            label="Property Type"
            options={distinctValues.propertyTypes}
            selected={config.filters.propertyTypes}
            onChange={(propertyTypes) => updateFilters({ propertyTypes })}
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-[#CCCCCC]">
          Sort
        </p>
        <select
          value={config.sortBy}
          onChange={(e) =>
            update({ sortBy: e.target.value as ListingFeedConfig['sortBy'] })
          }
          className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="custom_order">Custom Order</option>
        </select>
      </div>

      {/* Detail URL Pattern */}
      <div>
        <p className="mb-2 text-[12px] font-medium uppercase tracking-widest text-[#CCCCCC]">
          Listing Detail URL
        </p>
        <label className="mb-1.5 block text-[12px] font-medium text-[#888C99]">
          URL Pattern
        </label>
        <input
          value={config.detailPageUrlPattern}
          onChange={(e) => update({ detailPageUrlPattern: e.target.value })}
          placeholder="/listings/{slug}"
          className="h-[34px] w-full rounded-lg border border-[#EBEBEB] bg-[#F5F5F3] px-3 text-[13px] text-black placeholder:text-[#CCCCCC] focus:border-[#DAFF07] focus:outline-none focus:ring-1 focus:ring-[#DAFF07]"
        />
        <p className="mt-1 text-[11px] text-[#CCCCCC]">
          Use {'{slug}'} as the placeholder for the listing slug.
          Example: /listings/{'{slug}'} becomes /listings/123-main-st
        </p>
      </div>
    </div>
  );
}
