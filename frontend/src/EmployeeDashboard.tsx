import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table';
import axios from 'axios';
import { Checkbox } from './components/ui/checkbox';
import { Label } from './components/ui/label';
import { Delete, DeleteIcon, Plus, Trash } from 'lucide-react';

function EmployeeDashboard() {
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        department_id: null,
        role: ''
    });
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([])
    useEffect(() => {
        const getEmployees = async () => {
            await axios.get('http://localhost:3000/api/getEmployees')
                .then((response) => {
                    setEmployees(response.data)
                    console.log(response.data)
                })
        }
        const getDepartments = async () => {
            await axios.get('http://localhost:3000/api/getDepartments')
                .then((response) => {
                    setDepartments(response.data)
                    console.log(response.data)
                })
        }
        const getManagers = async () => {
            await axios.get("http://localhost:3000/api/getManagers")
                .then((response) => {
                    setManagers(response.data)
                    console.log('managers', response.data)
                })
        }
        getEmployees()
        getDepartments()
        getManagers()
    }, [])
    const [isManager, setIsManager] = useState(false)
    const handleSubmit = async () => {
        console.log(form)

        await axios.post('http://localhost:3000/api/saveEmployee', {
            ...form,
            role: form.role === "" ? null : form.role
        })

        setOpen(false);
        setForm({ name: "", email: "", department_id: null, role: "" });
    };
    useEffect(() => {
        if (isManager) {
            setForm((prev) => ({ ...prev, role: "" }));
        }
    }, [isManager]);

    return (
        <div className="w-6xl mx-auto px-6 py-10">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl text-gray-800 font-bold tracking-tight">Employee Dashboard</h1>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gray-800 text-white hover:bg-gray-900 flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            <span>Add Employee</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Add a New Employee</DialogTitle>
                            <DialogDescription>
                                Fill in the employee details and assign a department.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Full Name</label>
                                <Input
                                    placeholder="e.g. John Doe"
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <Input
                                    type="email"
                                    placeholder="e.g. john@example.com"
                                    value={form.email}
                                    onChange={(e) =>
                                        setForm({ ...form, email: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Department</label>
                                <Select
                                    value={form.department_id?.toString() ?? ""}
                                    onValueChange={(value) =>
                                        setForm({ ...form, department_id: parseInt(value) })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a Department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {departments.map((dept) => (
                                                <SelectItem
                                                    key={dept.id}
                                                    value={dept.id.toString()}
                                                >
                                                    {dept.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='flex gap-3'>
                                <Checkbox
                                    id="toggle"
                                    checked={isManager}
                                    onCheckedChange={(checked) => setIsManager(checked)}
                                />
                                <Label htmlFor="toggle">Department Manager</Label>  <Checkbox id="toggle" disabled />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Role</label>
                                <Input
                                    placeholder="e.g. Software Engineer"
                                    value={form.role}
                                    disabled={isManager}

                                    onChange={(e) =>
                                        setForm({ ...form, role: e.target.value })
                                    }
                                />
                            </div>

                            <div className="text-right pt-4">
                                <Button
                                    onClick={handleSubmit}
                                    className="text-white"
                                    disabled={!form.name || !form.email || !form.department_id || (!form.role &&
                                        !isManager)}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-lg border shadow-lg overflow-hidden">
                <Table className="w-full text-sm">
                    <TableHeader>
                        <TableRow className="bg-gray-800 hover:bg-gray-800 text-white">
                            <TableHead className="text-center py-4 px-6 text-white">ID</TableHead>
                            <TableHead className="text-center py-4 px-6 text-white">Name</TableHead>
                            <TableHead className="text-center py-4 px-6 text-white">Email</TableHead>
                            <TableHead className="text-center py-4 px-6 text-white">Department</TableHead>
                            <TableHead className="text-center py-4 px-6 text-white">Role</TableHead>
                            <TableHead className="text-center py-4 px-6 text-white">Delete</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {employees.map((emp, index) => (
                            <TableRow
                                key={emp.id}
                                className={`text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 transition-all`}
                            >
                                <TableCell className="py-4  px-6 font-bold">{emp.id}</TableCell>
                                <TableCell className="py-4 font-bold px-6">{emp.name}</TableCell>
                                <TableCell className="py-4 px-6">{emp.email}</TableCell>
                                <TableCell className="py-4 px-6">{emp.department_name}</TableCell>
                                <TableCell className="py-4 px-6">
                                    {emp.role ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600">
                                            {emp.role}
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold text-white bg-green-600">
                                            Manager
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center flex items-center justify-center pt-3">
                                    <Trash className="w-5 h-5 text-center text-red-600 hover:text-red-800 cursor-pointer" />
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>

        </div >
    );

}

export default EmployeeDashboard