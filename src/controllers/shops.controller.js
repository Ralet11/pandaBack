import Shop from "../models/shop.model.js";
import Owner from "../models/owner.model.js";
export const createShop = async (req, res) => {

  console.log(req.body, "body")
  try {
    const { owner_id } = req.body;

    // Verificamos que el owner exista
    const owner = await Owner.findByPk(owner_id);
    if (!owner) {
      return res.status(400).json({ message: 'Owner no existe.' });
    }

    const shop = await Shop.create(req.body);
    return res.status(201).json(shop);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Error al crear shop.' });
  }
};

export const getShops = async (_, res) => {
  try {
    const shops = await Shop.findAll({
      include: { model: Owner, attributes: { exclude: ['createdAt', 'updatedAt'] } }
    });
    return res.json(shops);
  } catch (err) {
    return res.status(500).json({ message: 'Error al obtener shops.' });
  }
};

export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, { include: Owner });
    if (!shop) return res.status(404).json({ message: 'Shop no encontrado.' });
    return res.json(shop);
  } catch (err) {
    return res.status(500).json({ message: 'Error interno.' });
  }
};

export const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop no encontrado.' });

    await shop.update(req.body);
    return res.json(shop);
  } catch (err) {
    return res.status(400).json({ message: 'Error al actualizar shop.' });
  }
};

export const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id);
    if (!shop) return res.status(404).json({ message: 'Shop no encontrado.' });

    await shop.destroy();
    return res.json({ message: 'Shop eliminado.' });
  } catch (err) {
    return res.status(500).json({ message: 'Error al eliminar shop.' });
  }
};