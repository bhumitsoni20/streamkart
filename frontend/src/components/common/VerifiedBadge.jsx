import React from 'react';
import { HiCheckCircle } from 'react-icons/hi';

/**
 * Reusable Verified Badge for Sellers
 * 
 * Supports:
 * 1. Admin manual verification (isVerified === true)
 * 2. Automatic threshold verification (totalSales >= 5)
 */
const VerifiedBadge = ({
  seller,
  isVerified: isVerifiedProp,
  verificationSource: verificationSourceProp,
  totalSales: totalSalesProp,
  size = 'sm',
  showLabel = true,
  showSource = false,
  className = '',
}) => {
  const isVerified = Boolean(
    seller?.isVerified === true ||
    isVerifiedProp === true ||
    (seller?.totalSales || 0) >= 5 ||
    (totalSalesProp || 0) >= 5
  );

  if (!isVerified) return null;

  const source = 
    seller?.verificationSource || 
    verificationSourceProp || 
    (seller?.isVerified || isVerifiedProp ? 'admin' : 'automatic');

  // Size styling variants
  const sizeClasses = {
    xs: {
      container: 'px-1.5 py-0.5 text-[9px] gap-0.5',
      icon: 'w-2.5 h-2.5',
    },
    sm: {
      container: 'px-2 py-0.5 text-[10px] gap-1',
      icon: 'w-3 h-3',
    },
    md: {
      container: 'px-2.5 py-1 text-[11px] gap-1.5',
      icon: 'w-3.5 h-3.5',
    },
    lg: {
      container: 'px-3 py-1.5 text-[12px] gap-1.5',
      icon: 'w-4 h-4',
    },
  }[size] || {
    container: 'px-2 py-0.5 text-[10px] gap-1',
    icon: 'w-3 h-3',
  };

  return (
    <span
      className={`inline-flex items-center font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs tracking-wide select-none ${sizeClasses.container} ${className}`}
      title={
        source === 'admin'
          ? 'Verified Merchant (Admin Verified)'
          : 'Verified Merchant (Sales Milestone Qualified)'
      }
    >
      <HiCheckCircle className={`${sizeClasses.icon} text-emerald-600 flex-shrink-0`} />
      {showLabel && <span>Verified</span>}
      {showSource && (
        <span className="text-[9px] font-bold text-emerald-600/80 opacity-90 uppercase tracking-wider ml-0.5">
          ({source})
        </span>
      )}
    </span>
  );
};

export default VerifiedBadge;
