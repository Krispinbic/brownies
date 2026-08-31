const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();

// Chaves de conexão do Supabase
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://jectwiinkpowimcncmqk.supabase.co/rest/v1/';
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || 'sb_publishable_pxw-1kJgQKH_SqttRtnTDw_0sL0wiwj';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// GET: Buscar todas as vendas
app.get('/api/sales', async (req, res) => {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST: Registrar nova venda
app.post('/api/sales', async (req, res) => {
  const { name, quantity, total, status, date } = req.body;
  const { data, error } = await supabase
    .from('sales')
    .insert([{ name, quantity, total, status, date }])
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT: Editar venda
app.put('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity, total, status, date } = req.body;
  
  const { data, error } = await supabase
    .from('sales')
    .update({ name, quantity, total, status, date })
    .eq('id', id)
    .select();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data[0]);
});

// DELETE: Excluir venda
app.delete('/api/sales/:id', async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase
    .from('sales')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Venda removida com sucesso' });
});

module.exports = app;