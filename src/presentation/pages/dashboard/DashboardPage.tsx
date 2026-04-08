
import Header from "../../components/layout/Header";
import StatCard from "../../components/ui/StatCard";
import Card from "../../components/ui/Card";
import "./DashboardPage.css";

// Demo data for KPIs, sales, and inventory
const kpis = [
  { label: "Ventas Hoy", value: "$2,350", icon: "💸", trend: "+8%" },
  { label: "Órdenes", value: "124", icon: "🧾", trend: "+3%" },
  { label: "Clientes", value: "87", icon: "👥", trend: "+5%" },
  { label: "Inventario Bajo", value: "3", icon: "⚠️", trend: "-1" },
];
const salesData = [
  { id: 1, product: "Baguette Clásica", qty: 24, total: "$480" },
  { id: 2, product: "Baguette Pollo", qty: 18, total: "$360" },
  { id: 3, product: "Baguette Jamón", qty: 15, total: "$300" },
];
const inventoryData = [
  { id: 1, name: "Harina", stock: 12, min: 10 },
  { id: 2, name: "Jamón", stock: 5, min: 8 },
  { id: 3, name: "Queso", stock: 7, min: 6 },
];

export default function DashboardPage() {
  return (
    <div className="dashboard-main">
      <Header title="Dashboard" />
      <div className="dashboard-kpis">
        {kpis.map((kpi) => (
          <StatCard key={kpi.label} {...kpi} />
        ))}
      </div>
      <div className="dashboard-panels">
        <Card title="Ventas recientes">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((sale) => (
                <tr key={sale.id}>
                  <td>{sale.product}</td>
                  <td>{sale.qty}</td>
                  <td>{sale.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Inventario bajo">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Ingrediente</th>
                <th>Stock</th>
                <th>Mínimo</th>
              </tr>
            </thead>
            <tbody>
              {inventoryData.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.stock}</td>
                  <td>{item.min}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
