import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, ChevronDown, ChevronUp, Eye, Edit, Trash2, Calendar, Tag, MapPin, Users, Clock, ChevronLeft, ChevronRight, X, Upload } from 'lucide-react'
import Image from '../../assets/placeholder.svg'
import TopBar from "../TopBar"
import { useNavigate } from 'react-router-dom'
import useAxiosPrivate from '@/hooks/useAxiosPrivate'
import { axiosPrivate } from '@/api/axios'
import { Skeleton } from '../ui/skeleton'
import ImageCarousel from '../ImageCarousel'
import ImageGallery from '../ImageGallery'
import { useToast } from "../../hooks/use-toast"

const estadoColors = {
  'Publicado': 'bg-green-100 text-green-800',
  'Borrador': 'bg-yellow-100 text-yellow-800',
  'Pendiente': 'bg-blue-100 text-blue-800'
}

const EditAnuncioModal = ({ anuncio, onSave, onClose, categorias }) => {
  const [editedAnuncio, setEditedAnuncio] = useState({
    id: anuncio?.id,
    usuario: 1,
    titulo: anuncio?.titulo,
    subtitulo: anuncio?.subtitulo,
    descripcion: anuncio?.descripcion,
    categoria: anuncio?.categoria.id,
    estado: anuncio?.estado
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setEditedAnuncio(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(editedAnuncio)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="titulo">Título</Label>
        <Input
          id="titulo"
          name="titulo"
          value={editedAnuncio.titulo}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="subtitulo">Subtítulo</Label>
        <Input
          id="subtitulo"
          name="subtitulo"
          value={editedAnuncio.subtitulo}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={editedAnuncio.descripcion}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select
          name="categoria"
          value={editedAnuncio?.categoria?.toString()}
          onValueChange={(value) => setEditedAnuncio(prev => ({ ...prev, categoria: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione una categoría" />
          </SelectTrigger>
          <SelectContent>
            {categorias.map((categoria) => (
              <SelectItem
                key={categoria.value}
                value={categoria.value.toString()}
              >
                {categoria.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="estado">Estado</Label>
        <Select
          name="estado"
          value={editedAnuncio.estado}
          onValueChange={(value) => handleChange({ target: { name: 'estado', value } })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Publicado">Publicado</SelectItem>
            <SelectItem value="Borrador">Borrador</SelectItem>
            <SelectItem value="Pendiente">Pendiente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2">
        {/* <Button type="button" variant="outline" onClick={() => {
          onClose();
          document.querySelector('dialog')?.close();
        }}>
          Cancelar
        </Button> */}
        <Button className="w-full" type="submit">Guardar cambios</Button>
      </div>
    </form>
  )
}

const Anuncio = ({ setIsOpened, isOpened }) => {
  const [expandedId, setExpandedId] = useState(null)
  const [listadoAnuncios, setListadoAnuncios] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingAnuncio, setEditingAnuncio] = useState(null)
  const [categorias, setCategorias] = useState([])
  const { toast } = useToast()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const extractCategoriesValues = (categories) => {
    return categories.map((category) => ({
      nombre: category.nombre,
      value: category.id
    }))
  }

  const fetchURLS = async (urls) => {
    try {
      const response = await axiosPrivate.get(urls)
      const categories = extractCategoriesValues(response.data)
      setCategorias(categories)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  useEffect(() => {
    fetchURLS('categorias/')
  }, [])

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  const handleOpenSidebar = () => {
    setIsOpened(!isOpened)
  }

  useEffect(() => {
    console.log('Anuncios')
    setIsLoading(true)
    axiosPrivate.get('anuncios-municipales/')
      .then((response) => {
        console.log(response.data.results)
        setListadoAnuncios(response.data.results)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoading(false)
      })
  }, [])

  const handleEditClick = (anuncio) => {
    setEditingAnuncio(anuncio)
  }

  const handleSaveEdit = (editedAnuncio) => {
    console.log(editedAnuncio)
    axiosPrivate.patch(`anuncios-municipales/${editedAnuncio.id}/`, editedAnuncio)
      .then(response => {
        console.log(response)
        toast({
          title: "Anuncio actualizado",
          description: "El anuncio ha sido actualizado exitosamente.",
          duration: 5000,
          className: "bg-green-500 text-white",
        })
        setListadoAnuncios(prevAnuncios =>
          prevAnuncios.map(a => a.id === editedAnuncio.id ? response.data : a)
        )
        setEditingAnuncio(null)
      })
      .catch(error => {
        console.error("Error updating anuncio:", error)
        toast({
          title: "Error",
          description: "Hubo un problema al actualizar el anuncio. Por favor, intente nuevamente.",
          variant: "destructive",
          duration: 5000,
        })
      })
  }

  return (
    <>
      <TopBar handleOpenSidebar={handleOpenSidebar} title="Anuncios" />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Listado de Anuncios</h1>
          <Button
            onClick={() => navigate('/anuncio-formulario')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Crear anuncio
          </Button>
        </div>
        <div className="space-y-4">
          {isLoading ? (
            [...Array(5)].map((_, index) => (
              <Skeleton key={index} className="w-full h-24" />
            ))
          ) : (
            listadoAnuncios?.map((anuncio) => (
              <Collapsible
                key={anuncio.id}
                open={expandedId === anuncio.id}
              >
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between w-full">
                      <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-0"
                          onClick={() => toggleExpand(anuncio.id)}
                        >
                          {expandedId === anuncio.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={estadoColors[anuncio.estado]}>{anuncio.estado}</Badge>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" /> {
                          new Date(anuncio.fecha).toLocaleDateString('es-CL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        }
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Tag className="h-4 w-4 mr-1" /> {anuncio.categoria.nombre}
                      </span>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                      <div className="px-4 pb-4 ">
                        <div className=' flex justify-center'>
                          <ImageCarousel images={anuncio.imagenes} title={anuncio.titulo} />
                        </div>
                        {anuncio.imagenes.length > 1 && (
                          <Dialog>
                            <DialogTrigger asChild className='bg-red-100'>
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 bg-red-100"
                              >
                                Ver todas las imágenes ({anuncio.imagenes.length})
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl w-full bg-red-200 ">
                              <ImageGallery images={anuncio.imagenes} title={anuncio.titulo} />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-4 top-4"
                                onClick={() => document.querySelector('dialog').close()}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    )}
                    <CardContent className="p-4 pt-0">
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Descripción</h4>
                        <p className="text-sm text-gray-700">
                          {anuncio.descripcion.length > 200
                            ? anuncio.descripcion.substring(0, 200) + '...'
                            : anuncio.descripcion}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <h4 className="font-semibold mb-1">Responsable</h4>
                          <p className="text-sm text-gray-700 flex items-center">
                            <Users className="h-4 w-4 mr-1" /> {"Municipalidad de calama"}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditClick(anuncio)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <EditAnuncioModal
                              anuncio={editingAnuncio}
                              onSave={handleSaveEdit}
                              onClose={() => setEditingAnuncio(null)}
                              categorias={categorias}
                            />
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))
          )}
        </div>
      </div>
    </>
  )
}

export default Anuncio

