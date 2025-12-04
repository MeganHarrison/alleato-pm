'use client';

import * as React from 'react';

interface SidebarProjectAddressProps {
  address: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
}

export function SidebarProjectAddress({
  address,
  city,
  state,
  zip,
  country = 'United States',
}: SidebarProjectAddressProps) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">Project Address</h3>
      <p className="text-sm text-gray-600">
        {address}
        <br />
        {city}, {state} {zip}
        <br />
        {country}
      </p>
    </div>
  );
}
