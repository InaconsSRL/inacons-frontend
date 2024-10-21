import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IMG from '../../components/IMG/IMG';
import LoaderPage from '../../components/Loader/LoaderPage';
import { mockData } from './mockDataHistorial';
import Modal from '../../components/Modal/Modal';
import TableComponent from '../../components/Table/TableComponent';
import { FiXCircle } from 'react-icons/fi';

import { deleteImagenRecurso } from '../../slices/recursoSlice';

interface FormData {
  id?: string;
  codigo: string;
  nombre: string;
  clasificacion_recurso_id: string;
  tipo_recurso_id: string;
  tipo_costo_recurso_id: string;
  unidad_id: string;
  descripcion: string;
  imagenes: { id: string; file: string; }[];
  precio_actual: number;
  vigente: boolean;
}

interface ResponseData {
  id: string;
  codigo: string;
  nombre: string;
  clasificacion_recurso_id: string;
  tipo_recurso_id: string;
  tipo_costo_recurso_id: string;
  unidad_id: string;
  descripcion: string;
  precio_actual: number;
  vigente: boolean;
  imagenes?: { id: string; file: string; }[];
}

interface Clasificacion {
  id: string;
  nombre: string;
  childs?: Clasificacion[];
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
  <label {...props} className="block text-xs font-medium text-gray-700 mb-1">
    {props.children}
  </label>
);

interface ResourceFormProps {
  initialValues: FormData;
  onSubmit: (data: FormData) => Promise<ResponseData | undefined>;
  options: {
    tipoCostoRecursos: Array<{ id: string; nombre: string }>;
    unidades: Array<{ id: string; nombre: string }>;
    tiposRecurso: Array<{ id: string; nombre: string }>;
    clasificaciones: Clasificacion[];
  };
}

const ResourceForm: React.FC<ResourceFormProps> = ({ initialValues, onSubmit, options }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSelectHistorial, setIsSelectHistorial] = useState(false);
  /* const [images, setImages] = useState<File[]>([]); */
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>(initialValues);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [isEditing, setIsEditing] = useState(!!initialValues.codigo);
  const [response, setResponse] = useState<ResponseData | null>(null);

  const handleImageUpload = async (file: File) => {
    if (!formData.id) {
      console.error('No se puede subir la imagen sin un ID de recurso');
      return;
    }

    setUploadingImage(true);

    const compressedImage = await compressImage(file);
    
    const formDataForUpload = new FormData();
    formDataForUpload.append('operations', JSON.stringify({
      query: `
        mutation ($recursoId: ID!, $files: [Upload!]!) {
          uploadImagenRecurso(recursoId: $recursoId, files: $files) {
            file
            id
          }
        }
      `,
      variables: {
        recursoId: formData.id,
        files: [null]
      }
    }));

    formDataForUpload.append('map', JSON.stringify({ "0": ["variables.files.0"] }));
    formDataForUpload.append('0', compressedImage);

    try {
      const response = await fetch('https://inacons-30db36fa833f.herokuapp.com/graphql', {
        method: 'POST',
        body: formDataForUpload,
      });

      const result = await response.json();

      if (result.errors) {
        console.error('Error al subir la imagen:', result.errors);
        alert('Error al subir la imagen.');
      } else {
        alert('Imagen subida exitosamente!');
        // Actualizar el estado local con la nueva imagen
        const newImage = result.data.uploadImagenRecurso[0];
        setFormData(prevData => ({
          ...prevData,
          imagenes: Array.isArray(prevData.imagenes) 
            ? [...prevData.imagenes, { ...newImage, __typename: "ImagenRecurso" }] 
            : [{ ...newImage, __typename: "ImagenRecurso" }]
        }));
        setImagePreviews(prevPreviews => [...prevPreviews, newImage.file]);
      }
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      alert('Error al subir la imagen.');
    } finally {
      setUploadingImage(false);
    }
  };

  /* useEffect(() => {
    if (response) {
      setFormData(response);
      setImagePreviews(initialValues.imagenes?.map((img: any) => img.file || img) || []);
    } else {
      if (initialValues) {
        setFormData(initialValues);
        setImagePreviews(initialValues.imagenes?.map((img: any) => img.file || img) || []);
      }
    }
  }, [initialValues, response]); */

  const defaultFormData = {
    codigo: '',
    nombre: '',
    clasificacion_recurso_id: '',
    tipo_recurso_id: '',
    tipo_costo_recurso_id: '',
    unidad_id: '',
    descripcion: '',
    imagenes: [],
    precio_actual: 0,
    vigente: false,
  };

  useEffect(() => {
    if (response && Object.keys(response).length > 0) {
      setFormData({...defaultFormData, ...response});
      console.log("response", response)
      console.log("me quedo con response")
    } else {
      if (initialValues && Object.keys(initialValues).length > 0) {
        setFormData({...defaultFormData, ...initialValues});
        console.log("me quedo con initialValues")
      } else {
        console.log("me quedo con default")
        setFormData(defaultFormData);
      }
    }
    setImagePreviews((response || initialValues)?.imagenes?.map((img: any) => img.file || img) || []);
  }, [initialValues, response]);


  
  const handleSelectHistorial = () => {
    setIsSelectHistorial(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'precio_actual' ? parseFloat(value) || 0 : value
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageUpload(file);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await dispatch(deleteImagenRecurso(imageId) as any);
      setFormData(prevData => ({
        ...prevData,
        imagenes: Array.isArray(prevData.imagenes) ? prevData.imagenes.filter(img => img.id !== imageId) : []
      }));
      setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => 
        formData.imagenes[i].id !== imageId
      ));
      alert('Imagen eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la imagen:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const handleSubmit = async (e: React.FormEvent | null, dataToSubmit = formData) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      console.log("dataToSubmit", dataToSubmit)
      const response = await onSubmit(dataToSubmit) as ResponseData;
      if (response) {
        setResponse(response);
        setFormData(prevData => ({
          ...prevData,
          ...response
        }));
        setIsEditing(true);
        alert('Recurso creado/actualizado exitosamente. Ahora puedes añadir imágenes.');
      }
    } catch (error) {
      console.error('Error al crear/actualizar el recurso:', error);
      alert('Error al crear/actualizar el recurso.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDuplicate = () => {
    const { id, ...dataWithoutId } = formData;
    const duplicatedData = {
      ...dataWithoutId,
      nombre: `${formData.nombre} copy`,
    };
    handleSubmit(null, duplicatedData);
  };

  /* const renderClasificaciones = (clasificaciones: Array<{ id: string; nombre: string; childs?: Array<{ id: string; nombre: string }> }>) => {
    return clasificaciones.map(clasificacion => (
      <React.Fragment key={clasificacion.id}>
        <option value={clasificacion.id}>{clasificacion.nombre}</option>
        {clasificacion.childs && clasificacion.childs.map(child => (
          <option key={child.id} value={child.id}>&nbsp;&nbsp;{child.nombre}</option>
        ))}
      </React.Fragment>
    ));
  }; */

  const renderClasificaciones = (clasificaciones: Clasificacion[]) => {
    console.log("clasificaciones", clasificaciones)
    return clasificaciones.map(clasificacion => (
      <React.Fragment key={clasificacion.id}>
        <option value="" disabled style={{ color: 'blue', fontWeight: 'bold' }}>
          {clasificacion.nombre}
        </option>
        {clasificacion.childs && clasificacion.childs.map(child => (
          <React.Fragment key={child.id}>
            <option value="" disabled className='pl-4 text-green-500 font-bold'>
              ├─ {child.nombre}
            </option>
            {child.childs  && child.childs.map(grandchild   => (
              <option
                key={grandchild.id}
                value={grandchild.id}
                style={{ color: 'black', paddingLeft: '40px' }}
              >
                │  └─ {grandchild.nombre}
              </option>
            ))}
          </React.Fragment>
        ))}
      </React.Fragment>
    ));
  };

  const tableData = {
    headers: ["Obra", "Fecha", "Tipo", "Nro", "Proveedor", "Unidad", "Cantidad", "Precio", "SubTotal"],
    filter: [true, true, true, true, true, true, true, true, false],
    rows: mockData.map((data, index) => ({
      Obra: data.obra,
      Fecha: data.fEmision,
      Tipo: data.tipoDoc,
      Nro: data.nroDoc,
      Proveedor: data.proveedor,
      Unidad: data.uEmb,
      Cantidad: data.cantidad,
      Precio: data.precio,
      SubTotal: data.subTotal,
      key: `row-${index}`
    }))
  };

  if (isSelectHistorial) return <Modal title='Historial de Precios' isOpen={isSelectHistorial} onClose={() => setIsSelectHistorial(false)} > <TableComponent tableData={tableData} /> </Modal>
  if (isLoading || uploadingImage) return <div className='flex justify-center items-center h-full bg-blue-900/70 rounded-lg'><LoaderPage /></div>;

  return (
    <form onSubmit={handleSubmit} className="rounded-lg max-w-4xl mx-auto text-xs transform origin-top-left">
      <div className="bg-gray-200 shadow-md rounded-lg px-4 py-2  ">
        <div className="flex flex-wrap justify-between p-2 gap-2 rounded-lg text-[10px] md:text-xs bg-gray-300">
          <Button type="button">Nuevo</Button>
          <Button type="button" onClick={handleDuplicate}>Duplicar</Button>
          <Button type="button">H.Cambios</Button>
          <Button type="button">H.Precios</Button>
          <Button type="button">Cambio Unidad</Button>
          <Button onClick={handleSelectHistorial} type="button">Ver Historial</Button>
          <Button type="button">Editar</Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Actualizar Recurso' : 'Crear Recurso'}
          </Button>
        </div>

        <div className="w-full h-0.5 bg-blue-800/20 rounded-full my-4"></div>

        <div className="mb-4 flex flex-row items-center">
          <div className='text-sm font-medium text-gray-700 text-end'>
            Codigo:
          </div>
          <div className='ml-2 px-2 h-8 text-gray-400 bg-gray-300 py-1.5 w-32 pr-3 rounded-lg border-solid borde min-w-32'>
            {formData.codigo}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-4">
          <div className='col-span-1 sm:col-span-8'>
            <div className="mb-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} />
            </div>
            <div className="mb-2">
              <Label htmlFor="clasificacion_recurso_id">Clase</Label>
              <Select id="clasificacion_recurso_id" name="clasificacion_recurso_id" value={formData.clasificacion_recurso_id} onChange={handleInputChange}>
                <option>--Elige--</option>
                {renderClasificaciones(options.clasificaciones)}
              </Select>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor="tipo_recurso_id">Tipo de Recurso</Label>
                <Select id="tipo_recurso_id" name="tipo_recurso_id" value={formData.tipo_recurso_id} onChange={handleInputChange}>
                  <option>--Elige--</option>
                  {options.tiposRecurso.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo_costo_recurso_id">Tipo Costo</Label>
                <Select id="tipo_costo_recurso_id" name="tipo_costo_recurso_id" value={formData.tipo_costo_recurso_id} onChange={handleInputChange}>
                  <option>--Elige--</option>
                  {options.tipoCostoRecursos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div className='col-span-1 sm:col-span-4'>
            <div className='mb-4'>
              <Label htmlFor="vigente">Vigente</Label>
              <div className="flex items-center mt-3 ">
                <input
                  type="checkbox"
                  id="vigente"
                  name="vigente"
                  checked={formData.vigente}
                  onChange={(e) => setFormData({ ...formData, vigente: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="vigente" className="ml-2 block text-sm text-gray-900">
                  {formData.vigente ? 'Sí' : 'No'}
                </label>
              </div>
            </div>
            <div className='mb-2'>
              <Label htmlFor="unidad_id">Unidad</Label>
              <Select id="unidad_id" name="unidad_id" value={formData.unidad_id} onChange={handleInputChange}>
                <option>--Elige--</option>
                {options.unidades.map(unidad => (
                  <option key={unidad.id} value={unidad.id}>{unidad.nombre}</option>
                ))}
              </Select>
            </div>
            <div className='mb-2'>
            <Label htmlFor="precio_actual">Costo Inicial</Label>
            <Input type='number' id="precio_actual" name="precio_actual" value={formData.precio_actual || ''} onChange={handleInputChange} />
          </div>
          </div>

          <div className="col-span-1 sm:col-span-12 mb-0">
            <Label htmlFor="descripcion">Descripcion</Label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              className='w-full border border-gray-300 rounded-md p-2 mt-1'
              rows={1}
            ></textarea>
          </div>
        </div>

        {formData.id && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Catálogo</h3>
          <div>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="w-full p-4 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-2 text-sm text-gray-600">
              {imagePreviews.length} {imagePreviews.length === 1 ? 'imagen mostrada' : 'imágeness mostradas'}
            </p>
          </div>

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 min-h-32 bg-slate-300 items-center justify-center rounded-md">
            {imagePreviews.length === 0 ? <div className='col-span-4 text-center text-gray-500 w-full'>No hay imágenes que mostrar...</div> : null}
            {imagePreviews.map((preview, index) => (
              <div key={`image-${index}`} className="relative p-2.5 ">
                <IMG src={preview} key={index} alt={`Preview ${index + 1}`} className="w-full min-h-28 object-cover rounded-md shadow-md shadow-slate-600" />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(formData.imagenes[index].id)}
                  className="absolute top-0 right-0 text-white rounded-full"
                >
                  <FiXCircle className='h-5 w-5 mr-2 text-white bg-red-500 rounded-full'/>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="costoPromedio">Costo Promedio</Label>
            <div className='min-w-32 mt-2 min-h-8 ml-2 px-2 text-gray-400 bg-gray-300 py-1.5 pr-3 rounded-md border-solid borde'> 125
            </div>

          </div>
          <div>
            <Label htmlFor="valorUltimaCompra">Valor Última Compra</Label>
            <div className='min-w-32 mt-2 min-h-8 ml-2 px-2 text-gray-400 bg-gray-300 py-1.5 pr-3 rounded-md border-solid borde'> 169
            </div>
          </div>
          
        </div>
      </div>
    </form>
  );
};

export default ResourceForm;
