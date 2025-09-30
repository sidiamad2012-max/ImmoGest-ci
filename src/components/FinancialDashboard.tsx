import React from "react";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Plus } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { dataService } from "../lib/services/dataService";

const monthlyRevenue = [
  { month: 'Jan', revenue: 11100000, expenses: 1920000 },
  { month: 'Fév', revenue: 11100000, expenses: 1680000 },
  { month: 'Mar', revenue: 11520000, expenses: 2460000 },
  { month: 'Avr', revenue: 11520000, expenses: 1740000 },
  { month: 'Mai', revenue: 11520000, expenses: 2100000 },
  { month: 'Jun', revenue: 12060000, expenses: 2280000 },
  { month: 'Jul', revenue: 12060000, expenses: 1620000 },
  { month: 'Aoû', revenue: 12060000, expenses: 2520000 },
  { month: 'Sep', revenue: 12480000, expenses: 1860000 },
  { month: 'Oct', revenue: 12480000, expenses: 2160000 },
  { month: 'Nov', revenue: 12480000, expenses: 1740000 },
  { month: 'Déc', revenue: 12900000, expenses: 2040000 }
];

const expenseBreakdown = [
  { name: 'Maintenance', value: 5100000, color: '#8884d8' },
  { name: 'Services Publics', value: 2520000, color: '#82ca9d' },
  { name: 'Assurance', value: 2160000, color: '#ffc658' },
  { name: 'Taxes Foncières', value: 4320000, color: '#ff7c7c' },
  { name: 'Gestion', value: 1440000, color: '#8dd1e1' },
  { name: 'Autres', value: 1080000, color: '#d084d0' }
];

export function FinancialDashboard() {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactionForm, setTransactionForm] = useState({
    type: "",
    description: "",
    amount: "",
    category: "",
    tenant: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [property, setProperty] = useState<any>(null);
  const [tenants, setTenants] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, [refreshKey]);

  const loadData = async () => {
    try {
      // Charger la première propriété
      const properties = await dataService.getProperties();
      if (properties.length > 0) {
        const firstProperty = properties[0];
        setProperty(firstProperty);
        
        // Charger les transactions
        const allTransactions = await dataService.getTransactions(firstProperty.id);
        setTransactions(allTransactions);
        
        // Formater les transactions récentes
        const recent = allTransactions
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 6)
          .map(transaction => ({
            id: transaction.id,
            type: transaction.type,
            description: transaction.description,
            amount: transaction.type === 'income' ? transaction.amount : -transaction.amount,
            date: transaction.date,
            category: transaction.category,
            tenant: transaction.tenant_id ? tenants.find(t => t.id === transaction.tenant_id)?.name : null
          }));
        
        setRecentTransactions(recent);
      }
      
      // Charger les locataires
      const allTenants = await dataService.getTenants();
      setTenants(allTenants);
    } catch (error) {
      console.error('Erreur lors du chargement des données financières:', error);
    }
  };

  const currentMonthRevenue = 12900000;
  const currentMonthExpenses = 2040000;
  const netIncome = currentMonthRevenue - currentMonthExpenses;
  const lastMonthNetIncome = 12480000 - 1740000;
  const incomeChange = ((netIncome - lastMonthNetIncome) / lastMonthNetIncome) * 100;

  const handleAddTransaction = async () => {
    if (!transactionForm.type || !transactionForm.description || !transactionForm.amount) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    if (!property) {
      toast.error("Aucune propriété disponible");
      return;
    }
    
    const transactionData = {
      property_id: property.id,
      type: transactionForm.type as 'income' | 'expense',
      description: transactionForm.description,
      amount: parseInt(transactionForm.amount),
      category: transactionForm.category || 'Autres',
      tenant_id: transactionForm.tenant || null,
      date: transactionForm.date
    };

    try {
      const result = await dataService.createTransaction(transactionData);
      
      if (result) {
        toast.success(`Transaction ${transactionForm.type === 'income' ? 'de recette' : 'de dépense'} ajoutée avec succès !`);
        setTransactionForm({
          type: "",
          description: "",
          amount: "",
          category: "",
          tenant: "",
          date: new Date().toISOString().split('T')[0]
        });
        setRefreshKey(prev => prev + 1); // Force refresh of recent transactions
        setIsAddingTransaction(false);
      } else {
        toast.error("Erreur lors de l'ajout de la transaction");
      }
    } catch (error) {
      console.error('Erreur lors de la création de la transaction:', error);
      toast.error("Erreur lors de l'ajout de la transaction");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1>Tableau de Bord Financier</h1>
          <p className="text-muted-foreground">Suivi des revenus, dépenses et performances financières</p>
        </div>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter Rapport
          </Button>
          <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter Transaction
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Ajouter Nouvelle Transaction</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Type de Transaction</Label>
                  <Select value={transactionForm.type} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Recette</SelectItem>
                      <SelectItem value="expense">Dépense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Input 
                    placeholder="Description de la transaction"
                    value={transactionForm.description}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Montant (FCFA)</Label>
                  <Input 
                    type="number"
                    placeholder="0"
                    value={transactionForm.amount}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Catégorie</Label>
                  <Select value={transactionForm.category} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Loyer">Loyer</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Services Publics">Services Publics</SelectItem>
                      <SelectItem value="Assurance">Assurance</SelectItem>
                      <SelectItem value="Taxes Foncières">Taxes Foncières</SelectItem>
                      <SelectItem value="Gestion">Gestion</SelectItem>
                      <SelectItem value="Autres">Autres</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {transactionForm.type === 'income' && (
                  <div>
                    <Label>Locataire (optionnel)</Label>
                    <Select value={transactionForm.tenant} onValueChange={(value) => setTransactionForm(prev => ({ ...prev, tenant: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner locataire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Aucun locataire</SelectItem>
                        {tenants.map((tenant) => (
                          <SelectItem key={tenant.id} value={tenant.id}>
                            {tenant.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date"
                    value={transactionForm.date}
                    onChange={(e) => setTransactionForm(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setTransactionForm({
                      type: "",
                      description: "",
                      amount: "",
                      category: "",
                      tenant: "",
                      date: new Date().toISOString().split('T')[0]
                    });
                    setIsAddingTransaction(false);
                  }}>
                    Annuler
                  </Button>
                  <Button onClick={handleAddTransaction}>
                    Ajouter Transaction
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenus Mensuels</p>
              <p className="text-2xl font-semibold">{currentMonthRevenue.toLocaleString()} FCFA</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+5.2%</span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Dépenses Mensuelles</p>
              <p className="text-2xl font-semibold">{currentMonthExpenses.toLocaleString()} FCFA</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-red-600 mr-1" />
                <span className="text-sm text-red-600">+3.8%</span>
              </div>
            </div>
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Revenus Nets</p>
              <p className="text-2xl font-semibold">{netIncome.toLocaleString()} FCFA</p>
              <div className="flex items-center mt-1">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-sm text-green-600">+{incomeChange.toFixed(1)}%</span>
              </div>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taux d'Occupation</p>
              <p className="text-2xl font-semibold">83%</p>
              <div className="flex items-center mt-1">
                <TrendingDown className="w-4 h-4 text-yellow-600 mr-1" />
                <span className="text-sm text-yellow-600">-2.1%</span>
              </div>
            </div>
            <Calendar className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue vs Expenses Chart */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3>Revenus vs Dépenses</h3>
            <Select defaultValue="12months">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6months">6 Mois</SelectItem>
                <SelectItem value="12months">12 Mois</SelectItem>
                <SelectItem value="2years">2 Ans</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, '']} />
              <Bar dataKey="revenue" fill="#8884d8" name="Revenus" />
              <Bar dataKey="expenses" fill="#82ca9d" name="Dépenses" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6">
          <h3 className="mb-4">Répartition des Dépenses (Annuelle)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Net Income Trend */}
      <Card className="p-6">
        <h3 className="mb-4">Évolution des Revenus Nets</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthlyRevenue.map(item => ({ ...item, netIncome: item.revenue - item.expenses }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value.toLocaleString()} FCFA`, 'Revenus Nets']} />
            <Line type="monotone" dataKey="netIncome" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Transactions */}
      <Card className="p-6" key={refreshKey}>
        <div className="flex items-center justify-between mb-4">
          <h3>Transactions Récentes</h3>
          <Button variant="ghost" size="sm">Voir Tout</Button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex-1">
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <p className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </p>
                  {transaction.tenant && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">{transaction.tenant}</p>
                    </>
                  )}
                  {transaction.category && (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <Badge variant="outline" className="text-xs">{transaction.category}</Badge>
                    </>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.amount > 0 ? '+' : ''}{Math.abs(transaction.amount).toLocaleString()} FCFA
                </p>
                <Badge variant={transaction.type === 'income' ? 'default' : 'secondary'} className="text-xs">
                  {transaction.type === 'income' ? 'Recette' : 'Dépense'}
                </Badge>
              </div>
            </div>
          ))}
          {recentTransactions.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              <p>Aucune transaction trouvée</p>
              <p className="text-sm">Ajoutez votre première transaction en cliquant sur le bouton ci-dessus</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
