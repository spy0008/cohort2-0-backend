import toast from "react-hot-toast";

const MAX_SIZE = 5 * 1024 * 1024;

const MainImageUpload = ({ images, setImages }) => {
  const handleFiles = (files) => {
    const valid = [];

    if (files.size > MAX_SIZE) {
      toast.error("Max 5MB allowed all images");
      return;
    }

    files.forEach((file) => {
      if (file.size > MAX_SIZE) {
        toast.error("Max 5MB allowed all images");
        return;
      }

      valid.push({
        file,
        preview: URL.createObjectURL(file),
      });
    });

    setImages((prev) => [...prev, ...valid]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(Array.from(e.dataTransfer.files));
  };

  return (
    <div>
      <p className="font-semibold mb-2">Main Images (Max 5MB all images)</p>

      <label
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="block border-2 border-dashed hover:border-orange-500 hover:bg-orange-50 transition p-6 rounded-xl text-center cursor-pointer"
      >
        Drag & Drop or Click to Upload
        <input
          type="file"
          multiple
          onChange={(e) => handleFiles(Array.from(e.target.files))}
          className="hidden"
        />
      </label>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {images.map((img, i) => (
          <div key={i} className="relative group">
            <img
              src={img.preview}
              className="h-24 w-full object-cover rounded-xl"
            />
            <button
              onClick={() => setImages(images.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 bg-orange-500 text-white rounded-full px-1 opacity-0 group-hover:opacity-100"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainImageUpload;
