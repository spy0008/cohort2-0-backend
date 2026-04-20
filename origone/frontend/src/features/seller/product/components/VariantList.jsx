import VariantItem from "./VariantItem";

const VariantList = ({ variants, setVariants }) => {
  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0, images: [] }]);
  };

  const updateVariant = (index, newData) => {
    const updated = [...variants];
    updated[index] = newData;
    setVariants(updated);
  };

  const removeVariant = (index) => {
    const updated = [...variants];
    updated.splice(index, 1);
    setVariants(updated);
  };

  return (
    <div>
      <h2 className="font-bold text-lg">Variants</h2>

      {variants.map((variant, index) => (
        <VariantItem
          key={index}
          index={index}
          variant={variant}
          updateVariant={updateVariant}
          removeVariant={removeVariant}
        />
      ))}

      <button
        onClick={addVariant}
        className="mt-4 bg-orange-100 text-orange-600 cursor-pointer px-4 py-2 rounded-lg hover:bg-orange-200"
      >
        + Add Variant
      </button>
    </div>
  );
};

export default VariantList;
