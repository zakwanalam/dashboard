import React, { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import axios from "axios"

type Manager = {
    id: number
    name: string
    email?: string
}

type Department = {
    id: number
    name: string
    description?: string
    manager_id: number
    manager_name: string
}

export default function DepartmentDashboard() {
    const [departments, setDepartments] = useState<Department[]>([])
    const [managers, setManagers] = useState<Manager[]>([])
    const [open, setOpen] = useState(false)
    const [form, setForm] = useState({
        name: "",
        description: "",
        manager_id: undefined as number | undefined,
        manager_name: "",
    })

    // Fetch Departments
    useEffect(() => {
        const getDepartments = async () => {
            const response = await axios.get("http://localhost:3000/api/getDepartments")
            setDepartments(response.data)
        }
        getDepartments()
    }, [])

    // Fetch Managers
    useEffect(() => {
        const getManagers = async () => {
            const response = await axios.get("http://localhost:3000/api/managers")
            setManagers(response.data)
        }
        getManagers()
    }, [])

    // Submit form
    const handleSubmit = async () => {
        const newId = departments.length + 1
        const manager = managers.find((m) => m.id === Number(form.manager_id))

        const newDept = {
            id: newId,
            name: form.name,
            description: form.description,
            manager_id: Number(form.manager_id),
            manager_name: manager?.name || "",
        }

        setDepartments([...departments, newDept])

        await axios.post("http://localhost:3000/api/saveDepartment", {
            name: form.name,
            description: form.description,
            manager_id: Number(form.manager_id),
        })

        setForm({ name: "", description: "", manager_id: 0, manager_name: "" })
        setOpen(false)
    }

    return (
        <div className="w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Department Dashboard</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-black text-white  hover:bg-gray-800">Add Department</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add a New Department</DialogTitle>
                            <DialogDescription>
                                Fill in the department details and assign a manager.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Department Name</label>
                                <Input
                                    placeholder="e.g. Engineering"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Manager</label>
                                <Select
                                    value={form.manager_id?.toString() ?? ""}
                                    onValueChange={(value) =>
                                        setForm({
                                            ...form,
                                            manager_id: parseInt(value),
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue className="" placeholder="Select a Manager" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {managers.map((manager) => (
                                                <SelectItem
                                                    key={manager.id}
                                                    value={manager.id.toString()}
                                                >
                                                    {manager.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <Textarea
                                    placeholder="Optional description..."
                                    value={form.description}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            description: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="text-right  pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    className="text-white"
                                    disabled={!form.name || !form.manager_id}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="text-center">ID</TableHead>
                            <TableHead className="text-center">Name</TableHead>
                            <TableHead className="text-center">Description</TableHead>
                            <TableHead className="text-center">Manager</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {departments.map((dept) => (
                            <TableRow key={dept.id} className="text-center">
                                <TableCell>{dept.id}</TableCell>
                                <TableCell className="font-medium">{dept.name}</TableCell>
                                <TableCell>{dept.description}</TableCell>
                                <TableCell>{dept.manager_name}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
