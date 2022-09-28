export function useNumberInput({ onChange, onBlur, hasDecimals, disabled, onClick }) {
  const numberFormat = val => (
    hasDecimals
      ? +val.replace(/,/g, '.')
      : +val.replace(/\D/g, '')
  );

  const handleClick = (e) => {
    e.preventDefault();
    const val = e.currentTarget.dataset.value;
    if (val < 0 || disabled) return;

    if (onClick) onClick(+val);
    else onChange(+val);
  };

  const handleChange = (e) => {
    if (e.target.value < 0 || disabled) return;
    onChange(numberFormat(e.target.value));
  };

  const handleBlur = (e) => {
    if (e.target.value < 0 || disabled || !onBlur) return;
    onBlur(numberFormat(e.target.value));
  };

  return {
    handleClick,
    handleChange,
    handleBlur,
  };
}
