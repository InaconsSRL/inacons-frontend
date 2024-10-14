import React, { useState } from 'react';
import IMG from '../../components/IMG/IMG';
import LoaderPage from '../../components/Loader/LoaderPage';

interface FormData {
  nombre: string;
  codigo: string;
  clase: string;
  claseDescripcion: string;
  tipoRecurso: string;
  tipoCosto: string;
  vigente: string;
  unidad: string;
  descripcion: string;
  costoPromedio: string;
  valorUltimaCompra: string;
  costoInicial: string;
}

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full border rounded-md p-2 mt-1">
    {props.children}
  </select>
);

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full border rounded-md p-2 mt-1" />
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'outline' | 'primary' }> = ({ variant = 'outline', children, ...props }) => (
  <button
    {...props}
    className={`px-2 py-2 rounded-md min-w-min sm:w-auto ${variant === 'outline'
      ? 'border border-gray-300 bg-white hover:bg-gray-300'
      : 'bg-blue-500 text-white hover:bg-blue-600'
      }`}
  >
    {children}
  </button>
);

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = (props) => (
  <label {...props} className="block text-sm font-medium text-gray-700 mb-1">
    {props.children}
  </label>
);

interface ResourceFormProps {
  initialValues: FormData;
  onSubmit: (data: FormData) => void;
  options: {
    unidades: Array<{ id: string; nombre: string }>;
    tiposRecurso: Array<{ id: string; nombre: string }>;
    clasificaciones: Array<{ id: string; nombre: string; childs?: Array<{ id: string; nombre: string }> }>;
  };
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialValues, onSubmit, options }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialValues || {
    nombre: 'New Resource',
    codigo: '123',
    clase: '1',
    claseDescripcion: 'Materiales Auxiliares',
    tipoRecurso: 'Material',
    tipoCosto: 'Ultimo de Compra',
    vigente: 'Si',
    unidad: '1',
    descripcion: 'Es una cosa bien buena',
    costoPromedio: '0',
    valorUltimaCompra: '0',
    costoInicial: '0'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          const scaleFactor = 0.7;

          canvas.width = img.width * scaleFactor;
          canvas.height = img.height * scaleFactor;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                resolve(file);
                return;
              }
              const newFileName = file.name.replace(/\.[^.]+$/, ".webp");

              resolve(
                new File([blob], newFileName, {
                  type: "image/webp",
                  lastModified: Date.now(),
                })
              );
            },
            "image/webp",
            0.8
          );
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setIsLoading(true);
    Promise.all(files.map((file) => compressImage(file)))
      .then((compressedImages) => {
        const newImages = compressedImages.filter((newImage) => 
          !images.some((existingImage) => existingImage.name === newImage.name)
        );
        setImages((prevImages) => [...prevImages, ...newImages]);
        setImagePreviews((prevPreviews) => [
          ...prevPreviews,
          ...newImages.map((image) => URL.createObjectURL(image)),
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    console.log('Form Data:', formData);
    console.log('Images:', images);
    // Aquí puedes enviar los datos del formulario y las imágenes a tu backend
  };

  const renderClasificaciones = (clasificaciones: Array<{ id: string; nombre: string; childs?: Array<{ id: string; nombre: string }> }>) => {
    return clasificaciones.map(clasificacion => (
      <React.Fragment key={clasificacion.id}>
        <option value={clasificacion.id}>{clasificacion.nombre}</option>
        {clasificacion.childs && clasificacion.childs.map(child => (
          <option key={child.id} value={child.id}>&nbsp;&nbsp;{child.nombre}</option>
        ))}
      </React.Fragment>
    ));
  };

  console.log(options.clasificaciones)
  if (isLoading) return <div className='flex justify-center items-center h-full bg-blue-900/70 rounded-lg'><LoaderPage /></div>;

  return (
    <form onSubmit={handleSubmit} className=" rounded-lg max-w-4xl mx-auto text-xs">
      <div className="bg-gray-200 shadow-md rounded-lg p-6">
        <div className="flex flex-wrap justify-between mb-4 gap-2 text-[8px] md:text-sm">
          <Button type="button">Nuevo</Button>
          <Button type="button">Duplicar</Button>
          <Button type="button">H.Cambios</Button>
          <Button type="button">Cambio Unidad</Button>
          <Button type="button">Ver Historial</Button>
          <Button type="button">Editar</Button>
          <Button type="submit" variant="primary">Grabar</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
          <div className='col-span-1 sm:col-span-8'>
            <div className="mb-2">
              <Label htmlFor="codigo">Codigo:</Label>
              <span>{formData.codigo}</span>
            </div>
            <div className="mb-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <Label htmlFor="clase">Clase</Label>              
              <Select id="tipoRecurso" name="tipoRecurso" value={formData.tipoRecurso} onChange={handleInputChange}>
                {renderClasificaciones(options.clasificaciones)}
              </Select>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor="tipoRecurso">Tipo de Recurso</Label>
                <Select id="tipoRecurso" name="tipoRecurso" value={formData.tipoRecurso} onChange={handleInputChange}>
                  {options.tiposRecurso.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="tipoCosto">Tipo Costo</Label>
                <Select id="tipoCosto" name="tipoCosto" value={formData.tipoCosto} onChange={handleInputChange}>
                  <option>Ultimo de Compra</option>
                  <option>Material</option>
                  <option>Mano de Obra</option>
                  <option>Subcontrato</option>
                  <option>Maquinaria</option>
                  <option>...</option>
                </Select>
              </div>
            </div>
          </div>
          <div className='col-span-1 sm:col-span-4'>
            <div className='mb-2'>
              <Label htmlFor="vigente">Vigente</Label>
              <Select id="vigente" name="vigente" value={formData.vigente} onChange={handleInputChange}>
                <option>Si</option>
                <option>No</option>
              </Select>
            </div>
            <div className='mb-2'>
              <Label htmlFor="unidad">Unidad</Label>
              <Select id="unidad" name="unidad" value={formData.unidad} onChange={handleInputChange}>
                {options.unidades.map((unidad) => (
                  <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="col-span-1 sm:col-span-12 mb-4">
            <Label htmlFor="descripcion">Descripcion</Label>
            <textarea 
              id="descripcion" 
              name="descripcion" 
              value={formData.descripcion} 
              onChange={handleInputChange} 
              className='w-full border border-gray-300 rounded-md p-2 mt-1' 
              rows={2}
            ></textarea>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">Catálogo</h3>
          <input
            type="file"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="w-full p-4 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative">
                <IMG src={preview} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded-md" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 m-1"
                >
                  X
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <Label htmlFor="costoPromedio">Costo Promedio</Label>
            <Input id="costoPromedio" name="costoPromedio" value={formData.costoPromedio} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="valorUltimaCompra">Valor Última Compra</Label>
            <Input id="valorUltimaCompra" name="valorUltimaCompra" value={formData.valorUltimaCompra} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="costoInicial">Costo Inicial</Label>
            <Input id="costoInicial" name="costoInicial" value={formData.costoInicial} onChange={handleInputChange} />
          </div>
        </div>
        <div className="flex flex-wrap justify-between mt-4 gap-2">
          <Button type="button">Ver Precios</Button>
          <Button type="button">Grabar Costo</Button>
          <Button type="button">Grabar Duración</Button>
        </div>
      </div>
    </form>
  );
};

export default ResourceForm;