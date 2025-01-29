import { Titulo } from '../../../../slices/tituloSlice';

export const buildTituloHierarchy = (titulos: Titulo[]) => {
  const buildItem = (parentId: string | null): Titulo[] => {
    return titulos
      .filter(t => t.id_titulo_padre === parentId)
      .sort((a, b) => a.orden - b.orden)
      .map(titulo => ({
        ...titulo,
        children: buildItem(titulo.id_titulo)
      }));
  };

  return buildItem(null);
};

export const generateNextItem = (parentItem: string | null, siblings: Titulo[]): string => {
  if (!parentItem) {
    const maxFirstLevel = Math.max(
      ...siblings
        .filter(t => t.nivel === 1)
        .map(t => parseInt(t.item.split('.')[0])) || [0]
    );
    return String(maxFirstLevel + 1).padStart(2, '0');
  }
  
  const siblingItems = siblings
    .filter(t => t.id_titulo_padre === parentItem)
    .map(t => t.item);
  
  if (siblingItems.length === 0) {
    return `${parentItem}.01`;
  }
  
  const maxChild = Math.max(
    ...siblingItems.map(item => {
      const parts = item.split('.');
      return parseInt(parts[parts.length - 1]);
    })
  );
    
  return `${parentItem}.${String(maxChild + 1).padStart(2, '0')}`;
};

export const validateItem = {
  /**
   * Valida si un item es único entre sus hermanos
   */
  isUnique: (newItem: string, parentId: string | null, titulos: Titulo[]): boolean => {
    const siblings = titulos.filter(t => t.id_titulo_padre === parentId);
    return !siblings.some(s => s.item === newItem);
  },

  /**
   * Valida el formato del item según el nivel
   */
  hasValidFormat: (item: string, nivel: number): boolean => {
    const parts = item.split('.');
    if (parts.length !== nivel) return false;
    return parts.every(part => /^\d{2}$/.test(part));
  },

  /**
   * Valida si el item sigue una secuencia válida con sus hermanos
   */
  followsSequence: (newItem: string, parentId: string | null, titulos: Titulo[]): boolean => {
    const siblings = titulos
      .filter(t => t.id_titulo_padre === parentId)
      .map(t => t.item)
      .sort();

    if (siblings.length === 0) return true;

    const newItemParts = newItem.split('.');
    const lastPart = parseInt(newItemParts[newItemParts.length - 1]);
    
    const existingNumbers = siblings.map(item => {
      const parts = item.split('.');
      return parseInt(parts[parts.length - 1]);
    });

    // Verifica que el número sea consecutivo
    const maxExisting = Math.max(...existingNumbers);
    return lastPart === maxExisting + 1;
  },

  /**
   * Validación completa de un item
   */
  isValid: (newItem: string, parentId: string | null, nivel: number, titulos: Titulo[]): boolean => {
    return (
      validateItem.isUnique(newItem, parentId, titulos) &&
      validateItem.hasValidFormat(newItem, nivel) &&
      validateItem.followsSequence(newItem, parentId, titulos)
    );
  }
};

export const validateTituloStructure = (titulo: Titulo, titulos: Titulo[]) => {
  // Validar nivel máximo
  if (titulo.nivel > 5) return false;

  // Validar que el padre existe
  if (titulo.id_titulo_padre && !titulos.find(t => t.id_titulo === titulo.id_titulo_padre)) {
    return false;
  }

  // Validar item único
  const siblings = titulos.filter(t => t.id_titulo_padre === titulo.id_titulo_padre);
  if (siblings.some(s => s.id_titulo !== titulo.id_titulo && s.item === titulo.item)) {
    return false;
  }

  return true;
};
