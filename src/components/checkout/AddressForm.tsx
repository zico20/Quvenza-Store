'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icon } from '@/components/ui/Icon';
import { GOVERNORATE_NAMES, getCitiesForGovernorate, getGovernorateName, getCityName } from '@/lib/iraq-locations';
import { useLang } from '@/hooks/useLang';

// Static schema just for type inference (not used for validation):
const _schemaForType = z.object({
  fullName:        z.string(),
  phone:           z.string(),
  governorate:     z.string(),
  city:            z.string(),
  address:         z.string(),
  nearestLandmark: z.string().optional(),
  isDefault:       z.boolean().optional(),
});

export type AddressFormData = z.infer<typeof _schemaForType>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void>;
  submitLabel?: string;
  loading?: boolean;
}

// ── Shared field styles ──────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px',
  background: '#F7F8FA', border: '1px solid #EAECEF', borderRadius: 4,
  color: '#111827', fontFamily: 'inherit', fontSize: 14, outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 6 }}>
      {children}
    </div>
  );
}

function ErrorMsg({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p style={{ color: '#EF4444', fontSize: 11, marginTop: 5, fontFamily: 'JetBrains Mono, monospace' }}>{msg}</p>;
}

// ── Component ────────────────────────────────────────────────
export function AddressForm({ defaultValues, onSubmit, submitLabel, loading = false }: AddressFormProps) {
  const { t, lang, isRTL } = useLang();

  const addressSchema = useMemo(() => z.object({
    fullName:        z.string().min(3, t('address.validation.fullNameMin')),
    phone:           z.string()
                       .min(11, t('address.validation.phoneMin'))
                       .regex(/^(\+964|0)?7[3-9][0-9]{8}$/, t('address.validation.phoneInvalid')),
    governorate:     z.string().min(1, t('address.validation.govRequired')),
    city:            z.string().min(1, t('address.validation.cityRequired')),
    address:         z.string().min(10, t('address.validation.addressMin')),
    nearestLandmark: z.string().optional(),
    isDefault:       z.boolean().optional(),
  }), [t]);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const selectedGovernorate = watch('governorate');
  const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedGovernorate) { setCities([]); return; }
    setCities(getCitiesForGovernorate(selectedGovernorate));
    setValue('city', '');
  }, [selectedGovernorate, setValue]);

  function focusStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = '#2563EB';
  }
  function blurStyle(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    e.currentTarget.style.borderColor = '#EAECEF';
  }

  const arrowPos = isRTL ? 'left 14px center' : 'right 14px center';
  const selectStyle: React.CSSProperties = {
    ...inputStyle,
    appearance: 'none', cursor: 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b6b70' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: arrowPos,
    paddingRight: isRTL ? 14 : 36,
    paddingLeft: isRTL ? 36 : 14,
  };

  const resolvedSubmitLabel = submitLabel ?? t('address.saveAddress');

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 16 }} suppressHydrationWarning>

      {/* Full Name */}
      <div>
        <Label>{t('address.fullName')}</Label>
        <input
          {...register('fullName')}
          style={inputStyle}
          onFocus={focusStyle} onBlur={blurStyle}
        />
        <ErrorMsg msg={errors.fullName?.message} />
      </div>

      {/* Phone */}
      <div>
        <Label>{t('address.phone')}</Label>
        <input
          {...register('phone')}
          type="tel"
          style={inputStyle}
          onFocus={focusStyle} onBlur={blurStyle}
        />
        <ErrorMsg msg={errors.phone?.message} />
      </div>

      {/* Governorate + City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label>{t('address.governorate')}</Label>
          <select {...register('governorate')} style={selectStyle} onFocus={focusStyle} onBlur={blurStyle}>
            <option value="">{t('address.governoratePlaceholder')}</option>
            {GOVERNORATE_NAMES.map(g => <option key={g} value={g}>{getGovernorateName(g, lang)}</option>)}
          </select>
          <ErrorMsg msg={errors.governorate?.message} />
        </div>
        <div>
          <Label>{t('address.city')}</Label>
          <select
            {...register('city')}
            style={{ ...selectStyle, opacity: selectedGovernorate ? 1 : 0.5 }}
            disabled={!selectedGovernorate}
            onFocus={focusStyle} onBlur={blurStyle}
          >
            <option value="">{selectedGovernorate ? t('address.cityPlaceholder') : t('address.cityWaiting')}</option>
            {cities.map(c => <option key={c} value={c}>{getCityName(c, lang)}</option>)}
          </select>
          <ErrorMsg msg={errors.city?.message} />
        </div>
      </div>

      {/* Street address */}
      <div>
        <Label>{t('address.street')}</Label>
        <textarea
          {...register('address')}
          rows={3}
          style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
          onFocus={focusStyle} onBlur={blurStyle}
        />
        <ErrorMsg msg={errors.address?.message} />
      </div>

      {/* Nearest landmark */}
      <div>
        <Label>{t('address.landmark')} <span style={{ color: '#9097A1', textTransform: 'none' }}>{t('address.landmarkOptional')}</span></Label>
        <input
          {...register('nearestLandmark')}
          style={inputStyle}
          onFocus={focusStyle} onBlur={blurStyle}
        />
      </div>

      {/* Default checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
        <div style={{ position: 'relative', width: 18, height: 18 }}>
          <input type="checkbox" {...register('isDefault')} style={{ opacity: 0, position: 'absolute', inset: 0, cursor: 'pointer', margin: 0 }} />
          <div style={{
            width: 18, height: 18, borderRadius: 3,
            border: '1.5px solid #EAECEF', background: '#F7F8FA',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {watch('isDefault') && <Icon name="check" size={12} style={{ color: '#2563EB' }} stroke={2.5} />}
          </div>
        </div>
        <span style={{ fontSize: 13, color: '#4B5563' }}>{t('address.setDefault')}</span>
      </label>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: '14px 24px', background: '#2563EB', color: '#fff',
          border: 'none', borderRadius: 4, fontSize: 14, fontWeight: 600,
          cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          fontFamily: 'inherit', transition: 'opacity 0.15s',
        }}
      >
        {loading ? (
          <>
            <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: 7, animation: 'spin 0.6s linear infinite' }} />
            {t('address.saving')}
          </>
        ) : resolvedSubmitLabel}
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
