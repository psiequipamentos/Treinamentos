import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:fl_chart/fl_chart.dart';

const String baseUrl = 'http://localhost:3000';

void main() {
  runApp(const GFinApp());
}

class GFinApp extends StatelessWidget {
  const GFinApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'GFin',
      home: LoginPage(),
    );
  }
}

class LoginPage extends StatefulWidget {
  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final emailCtrl = TextEditingController();
  final senhaCtrl = TextEditingController();

  Future<void> _login() async {
    final resp = await http.post(Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': emailCtrl.text, 'senha': senhaCtrl.text}));
    if (resp.statusCode == 200) {
      final token = jsonDecode(resp.body)['token'];
      Navigator.pushReplacement(
          context, MaterialPageRoute(builder: (_) => PerfisPage(token: token)));
    } else {
      ScaffoldMessenger.of(context)
          .showSnackBar(const SnackBar(content: Text('Falha no login')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Login')),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: emailCtrl,
              decoration: const InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: senhaCtrl,
              decoration: const InputDecoration(labelText: 'Senha'),
              obscureText: true,
            ),
            const SizedBox(height: 16),
            ElevatedButton(onPressed: _login, child: const Text('Entrar'))
          ],
        ),
      ),
    );
  }
}

class PerfisPage extends StatefulWidget {
  final String token;
  const PerfisPage({required this.token, Key? key}) : super(key: key);

  @override
  _PerfisPageState createState() => _PerfisPageState();
}

class _PerfisPageState extends State<PerfisPage> {
  List<dynamic> perfis = [];
  Map<String, dynamic>? resumo;
  List<dynamic> porCategoria = [];

  @override
  void initState() {
    super.initState();
    loadPerfis();
    loadResumo();
    loadPorCategoria();
  }

  Future<void> loadPerfis() async {
    final resp = await http.get(Uri.parse('$baseUrl/perfis'),
        headers: {'Authorization': 'Bearer ${widget.token}'});
    if (resp.statusCode == 200) {
      setState(() {
        perfis = jsonDecode(resp.body);
      });
    }
  }

  Future<void> loadResumo() async {
    final resp = await http.get(Uri.parse('$baseUrl/relatorios/resumo'),
        headers: {'Authorization': 'Bearer ${widget.token}'});
    if (resp.statusCode == 200) {
      setState(() {
        resumo = jsonDecode(resp.body);
      });
    }
  }

  Future<void> loadPorCategoria() async {
    final resp = await http.get(Uri.parse('$baseUrl/relatorios/por-categoria'),
        headers: {'Authorization': 'Bearer ${widget.token}'});
    if (resp.statusCode == 200) {
      setState(() {
        porCategoria = jsonDecode(resp.body);
      });
    }
  }

  Future<void> addMovimentacao() async {
    final body = {
      'perfil_id': 1,
      'categoria_id': 1,
      'valor': 10.0,
      'data': DateTime.now().toIso8601String(),
      'tipo': 'despesa'
    };
    await http.post(Uri.parse('$baseUrl/movimentacoes'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ${widget.token}'
        },
        body: jsonEncode(body));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Perfis')),
      body: Column(
        children: [
          if (resumo != null)
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  SizedBox(
                    height: 150,
                    child: PieChart(
                      PieChartData(
                        sections: [
                          PieChartSectionData(
                            value: double.tryParse(resumo!['receitas'].toString()) ?? 0,
                            color: Colors.green,
                            title: 'Receitas',
                          ),
                          PieChartSectionData(
                            value: double.tryParse(resumo!['despesas'].toString()) ?? 0,
                            color: Colors.red,
                            title: 'Despesas',
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Column(
                        children: [
                          const Text('Receitas'),
                          Text('${resumo!['receitas']}'),
                        ],
                      ),
                      Column(
                        children: [
                          const Text('Despesas'),
                          Text('${resumo!['despesas']}'),
                        ],
                      ),
                      Column(
                        children: [
                          const Text('Saldo'),
                          Text('${resumo!['saldo']}'),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  if (porCategoria.isNotEmpty)
                    SizedBox(
                      height: 200,
                      child: BarChart(
                        BarChartData(
                          barGroups: [
                            for (var i = 0; i < porCategoria.length; i++)
                              BarChartGroupData(x: i, barRods: [
                                BarChartRodData(
                                  toY: double.tryParse(porCategoria[i]['total'].toString()) ?? 0,
                                  color: Colors.blue,
                                )
                              ])
                          ],
                          titlesData: FlTitlesData(
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  final idx = value.toInt();
                                  if (idx >= 0 && idx < porCategoria.length) {
                                    return Text(
                                      porCategoria[idx]['categoria'],
                                      style: const TextStyle(fontSize: 10),
                                    );
                                  }
                                  return const SizedBox.shrink();
                                },
                              ),
                            ),
                            leftTitles: AxisTitles(
                              sideTitles: SideTitles(showTitles: true),
                            ),
                            rightTitles: AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                            topTitles: AxisTitles(
                                sideTitles: SideTitles(showTitles: false)),
                          ),
                          gridData: FlGridData(show: false),
                        ),
                      ),
                    ),
                ],
              ),
            ),
          Expanded(
            child: ListView.builder(
              itemCount: perfis.length,
              itemBuilder: (context, index) {
                final p = perfis[index];
                return ListTile(
                  title: Text(p['nome'] ?? ''),
                );
              },
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: addMovimentacao,
        child: const Icon(Icons.add),
      ),
    );
  }
}
