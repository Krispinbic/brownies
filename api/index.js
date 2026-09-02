const { createClient } = require('@supabase/supabase-js');

// Configuração das chaves do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jectwiinkpowimcncmqk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImplY3R3aWlua3Bvd2ltY25jbXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxODkwOTMsImV4cCI6MjEwMzc2NTA5M30.QodFjfIga6lWUShDJfhyuDesJB31O8axtyUVECPvX0M';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = async (req, res) => {
  // Liberar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Rota GET - Listar vendas
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('sales')
        .select('*')
        .order('id', { ascending: false });

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json(data || []);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Rota POST - Cadastrar venda
  if (req.method === 'POST') {
    try {
      const { name, quantity, total, status, date } = req.body;

      const { data, error } = await supabase
        .from('sales')
        .insert([{ name, quantity, total, status, date }]);

      if (error) return res.status(400).json({ error: error.message });
      return res.status(201).json({ message: 'Venda cadastrada!', data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Rota DELETE - Excluir venda
  if (req.method === 'DELETE') {
    try {
      const id = req.query.id || req.url.split('/').pop();
      const { error } = await supabase.from('sales').delete().eq('id', id);

      if (error) return res.status(400).json({ error: error.message });
      return res.status(200).json({ message: 'Venda excluída!' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Método não permitido' });
};