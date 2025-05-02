export const InputClassic = ({ onChange, value, title, placeholder, name, maxLength }) => {
  return (
    <>
      {title && (
        <label className="block text-sm font-medium text-gray-700">
          {title}
        </label>
      )}
      <input
        value={value}
        name={name}
        onChange={onChange}
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-sm"
        placeholder={placeholder}
        maxLength={maxLength}
      />
    </>
  );
};
