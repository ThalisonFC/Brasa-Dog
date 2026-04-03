import type { CustomizationOptions, ProductCustomizationConfig } from '@/types';

export const customizationOptions: CustomizationOptions = {
  breads: [
    { id: 'brioche', label: 'Brioche Artesanal', priceModifier: 0 },
    { id: 'australiano', label: 'Pão Australiano', priceModifier: 2 },
    { id: 'pretzel', label: 'Pretzel Defumado', priceModifier: 3 },
    { id: 'sem-gluten', label: 'Sem Glúten', priceModifier: 5 },
  ],
  sausages: [
    { id: 'classica', label: 'Salsicha Clássica', priceModifier: 0 },
    { id: 'frankfurt', label: 'Frankfurt Premium', priceModifier: 4 },
    { id: 'vegetariana', label: 'Salsichão Vegetariano', priceModifier: 2 },
    { id: 'toscana', label: 'Toscana Defumada', priceModifier: 6 },
  ],
  addons: [
    { id: 'bacon', label: 'Bacon Artesanal', price: 4, available: true },
    { id: 'queijo', label: 'Queijo Extra', price: 3, available: true },
    { id: 'caramelizada', label: 'Cebola Caramelizada', price: 3, available: true },
    { id: 'guacamole', label: 'Guacamole', price: 5, available: true },
    { id: 'trufa', label: 'Maionese de Trufa', price: 4, available: true },
    { id: 'pimenta', label: 'Relish de Pimenta', price: 3, available: true },
  ],
};

export function buildDefaultCustomizationConfig(): ProductCustomizationConfig {
  return {
    breads: customizationOptions.breads.map((b) => ({
      ...b,
      available: true,
    })),
    sausages: customizationOptions.sausages.map((s) => ({
      ...s,
      available: true,
    })),
    addons: customizationOptions.addons.map((a) => ({
      ...a,
      available: true,
    })),
  };
}
