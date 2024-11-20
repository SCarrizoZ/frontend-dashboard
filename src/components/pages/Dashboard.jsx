import { set } from 'date-fns'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, PieChart, Pie, LineChart, Line, AreaChart, Cell, Area, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Skeleton } from '../ui/skeleton'
import { Car } from 'lucide-react'
import TopBar from '../TopBar'
const Dashboard = ({ isOpened, setIsOpened }) => {
  // http://3.217.85.102/api/v1/publicaciones-por-categoria/ PIE CHART
  // http://3.217.85.102/api/v1/publicaciones-por-mes-y-categoria/ bar chart
  // http://3.217.85.102/api/v1/resumen-estadisticas/ cards

  const [barData, setBarData] = useState([])
  const [pieData, setPieData] = useState([])
  const [loading, setLoading] = useState(true)
  const [cardsData, setCardsData] = useState({})
  const [barKeys, setBarKeys] = useState([])
  // fetch all
  const fetchData = async (urls) => {
    setLoading(true)
    console.log(urls)
    const requests = urls.map(url => fetch(url,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      }
    }))
    // console.log(requests)
    const responses = await Promise.all(requests)
    const data = await Promise.all(responses.map(response => {
      console.log(response.data);
      return response.json()
    }))
    console.log(data[0])
    console.log(data[1])
    let distinctValues = []
    data[0].map((monthData, i) => {
      console.log(Object.keys(monthData))
      Object.keys(monthData).forEach((key, index) => {
        if (!distinctValues.includes(key) && key !== 'name') {
          distinctValues.push(key)
        }
      })
    })
    console.log(data[2])
    console.log(distinctValues)
    setCardsData(data[2])
    setBarKeys(distinctValues)
    setBarData(data[0])
    setPieData(data[1])
    setLoading(false)
  }




  useEffect(() => {
    fetchData([
      `${import.meta.env.VITE_URL_PROD_VERCEL}publicaciones-por-mes-y-categoria/`,
      `${import.meta.env.VITE_URL_PROD_VERCEL}publicaciones-por-categoria`,
      `${import.meta.env.VITE_URL_PROD_VERCEL}resumen-estadisticas/`
    ])
  }, [])

  const handleOpenSidebar = () => {
    setIsOpened(!isOpened)
  }
  const barChartData = [
    { name: 'Ene', Infraestructura: 4000, Seguridad: 2400, Medio_Ambiente: 2400 },
    { name: 'Feb', Infraestructura: 3000, Seguridad: 1398, Medio_Ambiente: 2210 },
    { name: 'Mar', Infraestructura: 2000, Seguridad: 9800, Medio_Ambiente: 2290 },
    { name: 'Abr', Infraestructura: 2780, Seguridad: 3908, Medio_Ambiente: 2000 },
    { name: 'May', Infraestructura: 1890, Seguridad: 4800, Medio_Ambiente: 2181 },
    { name: 'Jun', Infraestructura: 2390, Seguridad: 3800, Medio_Ambiente: 2500 },
  ]

  const pieChartData = [
    { name: 'Infraestructura', value: 400 },
    { name: 'Seguridad', value: 300 },
    { name: 'Medio Ambiente', value: 300 },
    { name: 'Cultura', value: 200 },
  ]

  const lineChartData = [
    { name: 'Ene', resueltos: 400 },
    { name: 'Feb', resueltos: 300 },
    { name: 'Mar', resueltos: 500 },
    { name: 'Abr', resueltos: 280 },
    { name: 'May', resueltos: 590 },
    { name: 'Jun', resueltos: 320 },
  ]

  const areaChartData = [
    { name: 'Ene', Infraestructura: 4000, Seguridad: 2400, Medio_Ambiente: 2400 },
    { name: 'Feb', Infraestructura: 3000, Seguridad: 1398, Medio_Ambiente: 2210 },
    { name: 'Mar', Infraestructura: 2000, Seguridad: 9800, Medio_Ambiente: 2290 },
    { name: 'Abr', Infraestructura: 2780, Seguridad: 3908, Medio_Ambiente: 2000 },
    { name: 'May', Infraestructura: 1890, Seguridad: 4800, Medio_Ambiente: 2181 },
    { name: 'Jun', Infraestructura: 2390, Seguridad: 3800, Medio_Ambiente: 2500 },
  ]

  const scatterChartData = [
    { prioridad: 1, tiempoResolucion: 24, categoria: 'Infraestructura' },
    { prioridad: 2, tiempoResolucion: 36, categoria: 'Seguridad' },
    { prioridad: 3, tiempoResolucion: 48, categoria: 'Medio Ambiente' },
    { prioridad: 1, tiempoResolucion: 18, categoria: 'Infraestructura' },
    { prioridad: 2, tiempoResolucion: 30, categoria: 'Seguridad' },
    { prioridad: 3, tiempoResolucion: 42, categoria: 'Medio Ambiente' },
  ]

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  const filters = {
    category: "infraestructura",
    council: "junta1",
    status: "recibido",
    startDate: "2022-01-01",
    endDate: "2022-12-31",
  }
  const clearFilters = () => {
    console.log("clear filters")
  }
  const applyFilters = () => {
    console.log("apply filters")
  }
  return (
    <>
      <TopBar handleOpenSidebar={handleOpenSidebar} title="Dashboard" />
      <div className="p-8 bg-gray-100 min-h-screen">
        <div className="p-8 bg-gray-100 min-h-screen">
          <h1 className="text-3xl font-bold mb-6">Dashboard Municipal</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {
              loading ? (
                <>
                  <Skeleton width="full" height="h-32" >
                    <Card className="h-32 bg-inherit">
                    </Card>
                  </Skeleton>
                  <Skeleton width="full" height="h-32" >
                    <Card className="h-32 bg-inherit">
                    </Card>
                  </Skeleton>
                  <Skeleton width="full" height="h-32" >
                    <Card className="h-32 bg-inherit">
                    </Card>
                  </Skeleton>


                </>


              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publicaciones Recibidas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{cardsData?.publicaciones}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Usuarios activos</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{cardsData?.usuarios}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publicaciones Resueltas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-4xl font-bold">{cardsData?.problemas_resueltos}</p>
                    </CardContent>
                  </Card>

                </>
              )
            }


          </div>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <Select onValueChange={(value) => handleFilterChange('category', value)} value={filters.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="infraestructura">Infraestructura</SelectItem>
                      <SelectItem value="seguridad">Seguridad</SelectItem>
                      <SelectItem value="medio_ambiente">Medio Ambiente</SelectItem>
                      <SelectItem value="cultura">Cultura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Junta Vecinal</label>
                  <Select onValueChange={(value) => handleFilterChange('council', value)} value={filters.council}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar junta vecinal" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="junta1">Junta Vecinal 1</SelectItem>
                      <SelectItem value="junta2">Junta Vecinal 2</SelectItem>
                      <SelectItem value="junta3">Junta Vecinal 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Situación</label>
                  <Select onValueChange={(value) => handleFilterChange('status', value)} value={filters.status}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar situación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recibido">Recibido</SelectItem>
                      <SelectItem value="en_curso">En Curso</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
                  {/* skeleton fake datepicker */}
                  <Skeleton width="full" height="h-10">
                    <input type="text" className="border rounded-l px-2 py-1 w-full md:w-1/2" placeholder="Ej: 31-10-2024" />
                  </Skeleton>
                  {/* <DatePicker
                    selectedDate={filters.startDate}
                    onDateSelect={(date) => handleFilterChange('startDate', date)}
                  /> */}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                  {/* skeleton fake datepicker */}
                  <Skeleton width="full" height="h-10">
                    <input type="text" className="border rounded-l px-2 py-1 w-full md:w-1/2" placeholder="Ej: 31-10-2024" />
                  </Skeleton>
                  {/* <DatePicker
                    selectedDate={filters.endDate}
                    onDateSelect={(date) => handleFilterChange('endDate', date)}
                  /> */}
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={clearFilters}>Limpiar Filtros</Button>
                <Button onClick={applyFilters}>Aplicar Filtros</Button>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {
              loading ? (
                <>
                  <Skeleton width="full" height="h-96">
                    <Card className="h-96 bg-inherit">
                    </Card>
                  </Skeleton>
                  <Skeleton width="full" height="h-96">
                    <Card className="h-96 bg-inherit">
                    </Card>
                  </Skeleton>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Publicaciones por Mes y Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          {barKeys.map((key, index) => (
                            <Bar key={index} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
                          ))}
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Distribución de Publicaciones por Categoría</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {pieData?.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )

            }


          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Tendencia de Resolución de Problemas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="resueltos" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Presupuesto Asignado por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={areaChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="Infraestructura" stackId="1" stroke="#8884d8" fill="#8884d8" />
                    <Area type="monotone" dataKey="Seguridad" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="Medio_Ambiente" stackId="1" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Relación entre Tiempo de Resolución y Prioridad</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid />
                  <XAxis type="number" dataKey="prioridad" name="Prioridad" />
                  <YAxis type="number" dataKey="tiempoResolucion" name="Tiempo de Resolución (horas)" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Legend />
                  <Scatter name="Problemas" data={scatterChartData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <Button>Nueva Publicación</Button>
                <Button variant="outline">Ver Todas las Publicaciones</Button>
                <Button variant="outline">Generar Reporte</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    
    </>


   
  )
}

export default Dashboard