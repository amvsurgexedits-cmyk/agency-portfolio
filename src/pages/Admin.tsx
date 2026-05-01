import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Image, Users, Wrench, Plus, Trash2, Edit2, Instagram, Linkedin, Layers, LayoutDashboard, Inbox } from 'lucide-react';
import Button from '../components/Button';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit for client-side check

const Admin: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [passphrase, setPassphrase] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'tools' | 'portfolio' | 'team' | 'services'>('dashboard');
    const [dashboardData, setDashboardData] = useState<{ contacts: any[], portfolioCount: number }>({ contacts: [], portfolioCount: 0 });
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Modal & Form State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newItem, setNewItem] = useState({
        label: '',
        value: '',
        client: '',
        year: new Date().getFullYear().toString(),
        linkedin: '',
        instagram: '',
        deliverables: '', // For services
        iconName: 'Palette', // For services
        display_location: 'portfolio', // For portfolio
        file: null as File | null,
        galleryFiles: [] as File[]
    });
    const [isSaving, setIsSaving] = useState(false);

    // Simple passphrase protection
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (passphrase === 'fraimiix_admin') {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect Passphrase');
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated, activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        if (activeTab === 'dashboard') {
            const { data: contactsResult, error: contactsError } = await supabase
                .from('contacts')
                .select('*')
                .order('created_at', { ascending: false });

            const { count: portfolioCount, error: portfolioError } = await supabase
                .from('portfolio_items')
                .select('*', { count: 'exact', head: true });

            if (contactsError) setError(contactsError.message);
            
            setDashboardData({
                contacts: contactsResult || [],
                portfolioCount: portfolioCount || 0
            });
            setLoading(false);
            return;
        }

        let tableName = '';
        switch (activeTab) {
            case 'tools': tableName = 'tools'; break;
            case 'portfolio': tableName = 'portfolio_items'; break;
            case 'team': tableName = 'team_members'; break;
            case 'services': tableName = 'services'; break;
        }

        const { data: result, error: fetchErr } = await supabase
            .from(tableName)
            .select('*')
            .order('display_order', { ascending: true });

        if (fetchErr) {
            console.error("Fetch Error:", fetchErr);
            setError(fetchErr.message);
        } else if (result) {
            setData(result);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        let tableName = '';
        switch (activeTab) {
            case 'tools': tableName = 'tools'; break;
            case 'portfolio': tableName = 'portfolio_items'; break;
            case 'team': tableName = 'team_members'; break;
            case 'services': tableName = 'services'; break;
            case 'dashboard': tableName = 'contacts'; break;
        }
        const { error } = await supabase.from(tableName).delete().eq('id', id);
        if (!error) fetchData();
    };

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setNewItem({
            label: item.label || item.title || item.name || '',
            value: item.value || item.category || item.role || item.description || '',
            client: item.client || '',
            year: item.year || new Date().getFullYear().toString(),
            linkedin: item.linkedin_url || '',
            instagram: item.instagram_url || '',
            deliverables: item.deliverables?.join('\n') || '',
            iconName: item.icon_name || 'Palette',
            display_location: item.display_location || 'portfolio',
            file: null,
            galleryFiles: []
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setError(null);

        try {
            let imageUrl = data.find(i => i.id === editingId)?.image_url || '';
            let tableName = '';
            switch (activeTab) {
                case 'tools': tableName = 'tools'; break;
                case 'portfolio': tableName = 'portfolio_items'; break;
                case 'team': tableName = 'team_members'; break;
                case 'services': tableName = 'services'; break;
            }

            // 1. Upload Image if new one selected
            if (newItem.file) {
                const fileExt = newItem.file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const filePath = `${activeTab}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('uploads')
                    .upload(filePath, newItem.file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('uploads')
                    .getPublicUrl(filePath);

                imageUrl = urlData.publicUrl;
            }

            // 2. Prepare payload
            const payload: any = {};
            if (activeTab === 'tools') {
                payload.name = newItem.label;
                payload.image_url = imageUrl;
            } else if (activeTab === 'portfolio') {
                payload.title = newItem.label;
                payload.category = newItem.value;
                payload.client = newItem.client || 'Fraimiix Client';
                payload.year = newItem.year;
                payload.image_url = imageUrl;
                payload.display_location = newItem.display_location;
            } else if (activeTab === 'team') {
                payload.name = newItem.label;
                payload.role = newItem.value;
                payload.image_url = imageUrl;
                payload.linkedin_url = newItem.linkedin;
                payload.instagram_url = newItem.instagram;
            } else if (activeTab === 'services') {
                payload.id = newItem.label; // Use the slug as the record ID
                payload.title = newItem.label.replace('-', ' ');
                payload.description = "Mockup managed via Admin";
                payload.image_url = imageUrl;
            }

            // 2.5 Handle Gallery Uploads for Portfolio
            if (activeTab === 'portfolio' && newItem.galleryFiles.length > 0) {
                const galleryUrls: string[] = editingId ? (data.find(i => i.id === editingId)?.gallery_urls || []) : [];
                for (const file of newItem.galleryFiles) {
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `gallery/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('uploads')
                        .upload(filePath, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('uploads')
                        .getPublicUrl(filePath);

                    galleryUrls.push(urlData.publicUrl);
                }
                payload.gallery_urls = galleryUrls;
            }

            // 3. Upsert into Database
            if (activeTab === 'services') {
                // Upsert by ID (slug)
                const { error: upsertError } = await supabase.from(tableName).upsert([payload]);
                if (upsertError) throw upsertError;
            } else if (editingId) {
                const { error: updateError } = await supabase.from(tableName).update(payload).eq('id', editingId);
                if (updateError) throw updateError;
            } else {
                const { error: insertError } = await supabase.from(tableName).insert([payload]);
                if (insertError) throw insertError;
            }

            // 4. Success cleanup
            setIsModalOpen(false);
            setEditingId(null);
            setNewItem({ label: '', value: '', client: '', year: new Date().getFullYear().toString(), linkedin: '', instagram: '', deliverables: '', iconName: 'Palette', display_location: 'portfolio', file: null, galleryFiles: [] });
            fetchData();
        } catch (err: any) {
            console.error("Save failed:", err);
            setError(`Save failed: ${err.message || "Unknown Error"}`);
        } finally {
            setIsSaving(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0C0C0C] flex items-center justify-center p-6">
                <div className="w-full max-w-[400px] bg-[#141414] border border-[#1C1C1C] p-8 rounded-[8px]">
                    <div className="text-center mb-8">
                        <img src="/logo.svg" alt="Fraimiix" className="w-12 h-12 mx-auto mb-4" />
                        <h1 className="font-[SpaceGrotesk] font-bold text-[24px] text-white">Agency Admin</h1>
                        <p className="text-[#A0A0A0] text-[14px]">Enter passphrase to manage content</p>
                    </div>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <input
                            type="password"
                            placeholder="Passphrase"
                            className="w-full bg-transparent border border-[#333] p-4 text-white focus:outline-none focus:border-[#FF4D00] transition-colors"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                        />
                        <button className="w-full bg-[#FF4D00] text-black font-bold py-4 hover:bg-[#FF6A26] transition-colors rounded-[2px] uppercase tracking-wider text-[14px]">
                            Enter Dashboard
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0C0C0C] text-white font-[Inter]">
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-[260px] bg-[#0C0C0C] border-r border-[#1C1C1C] p-8">
                <div className="flex items-center space-x-3 mb-12">
                    <img src="/logo.svg" alt="Fraimiix" className="w-8 h-8" />
                    <span className="font-[SpaceGrotesk] font-bold text-[20px] tracking-widest uppercase">FRAIMIIX</span>
                </div>

                <nav className="space-y-2">
                    {[
                        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
                        { id: 'services', label: 'Service Mockups', icon: Layers },
                        { id: 'portfolio', label: 'Portfolio Gallery', icon: Image },
                        { id: 'team', label: 'Agency Team', icon: Users },
                        { id: 'tools', label: 'Studio Tools', icon: Wrench },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center space-x-3 p-4 rounded-[4px] transition-colors ${activeTab === item.id ? 'bg-[#FF4D00] text-black font-bold' : 'text-[#A0A0A0] hover:bg-[#141414]'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="ml-[260px] p-12">
                <div className="flex items-center justify-between mb-12">
                    <h2 className="font-[SpaceGrotesk] font-bold text-[32px] uppercase">
                        {activeTab === 'dashboard' ? 'Analytics Overview' : activeTab === 'services' ? 'Service Mockups' : activeTab === 'portfolio' ? 'Portfolio Hub' : activeTab === 'tools' ? 'Build Tools' : 'Our Team'}
                    </h2>
                    {activeTab !== 'dashboard' && (
                        <Button variant="primary" onClick={() => {
                            setEditingId(null);
                            setError(null);
                            setNewItem({ label: '', value: '', client: '', year: new Date().getFullYear().toString(), linkedin: '', instagram: '', deliverables: '', iconName: 'Palette', display_location: 'portfolio', file: null, galleryFiles: [] });
                            setIsModalOpen(true);
                        }}>
                            <Plus size={18} className="mr-2" />
                            Add New
                        </Button>
                    )}
                </div>

                {error && (
                    <div className="bg-[#331111] border border-[#662222] text-[#FF6B6B] p-6 rounded-[8px] mb-8 font-[Inter] text-[14px]">
                        <p className="font-bold mb-2">Error Connecting to Database:</p>
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="animate-pulse text-[#FF4D00]">Loading content...</div>
                ) : activeTab === 'dashboard' ? (
                    <div className="space-y-8">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-[#141414] border border-[#1C1C1C] p-6 rounded-[8px]">
                                <h3 className="text-[#A0A0A0] text-[14px] uppercase tracking-wider font-bold mb-2">Total Client Leads</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#FF4D00]">
                                        <Inbox size={24} />
                                    </div>
                                    <span className="text-[32px] font-[SpaceGrotesk] font-bold">{dashboardData.contacts.length}</span>
                                </div>
                            </div>
                            <div className="bg-[#141414] border border-[#1C1C1C] p-6 rounded-[8px]">
                                <h3 className="text-[#A0A0A0] text-[14px] uppercase tracking-wider font-bold mb-2">Live Portfolio Projects</h3>
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 rounded-full bg-[#1C1C1C] flex items-center justify-center text-[#FF4D00]">
                                        <Image size={24} />
                                    </div>
                                    <span className="text-[32px] font-[SpaceGrotesk] font-bold">{dashboardData.portfolioCount}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contacts Table */}
                        <div className="bg-[#141414] border border-[#1C1C1C] rounded-[8px] overflow-hidden">
                            <div className="p-6 border-b border-[#1C1C1C]">
                                <h3 className="font-[SpaceGrotesk] font-bold text-[20px] uppercase tracking-widest">Recent Submissions</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-[#1C1C1C] text-[#A0A0A0] text-[12px] uppercase tracking-wider">
                                            <th className="p-4 font-bold">Date</th>
                                            <th className="p-4 font-bold">Name</th>
                                            <th className="p-4 font-bold">Contact</th>
                                            <th className="p-4 font-bold">Service</th>
                                            <th className="p-4 font-bold">Message</th>
                                            <th className="p-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[14px]">
                                        {dashboardData.contacts.length > 0 ? (
                                            dashboardData.contacts.map(contact => (
                                                <tr key={contact.id} className="border-b border-[#1C1C1C] hover:bg-[#1A1A1A] transition-colors">
                                                    <td className="p-4 text-[#888] whitespace-nowrap">{new Date(contact.created_at).toLocaleDateString()}</td>
                                                    <td className="p-4 font-bold">{contact.name}</td>
                                                    <td className="p-4">
                                                        <div className="flex flex-col text-[#A0A0A0]">
                                                            <a href={`mailto:${contact.email}`} className="hover:text-[#FF4D00] transition-colors">{contact.email}</a>
                                                            <a href={`tel:${contact.phone}`} className="hover:text-[#FF4D00] transition-colors">{contact.phone}</a>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <span className="bg-[#222] text-[#CCC] px-3 py-1 rounded-full text-[12px] capitalize">
                                                            {contact.service?.replace('-', ' ')}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 max-w-[300px] truncate text-[#A0A0A0]" title={contact.message}>{contact.message}</td>
                                                    <td className="p-4 text-right">
                                                        <button onClick={() => handleDelete(contact.id)} className="p-2 text-[#555] hover:text-[#FF4D00] transition-colors" title="Delete Lead">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="p-8 text-center text-[#666]">No leads yet. They'll appear here when someone fills out the contact form.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {data.map((item) => (
                            <div key={item.id} className="bg-[#141414] border border-[#1C1C1C] p-6 rounded-[4px] flex items-center justify-between group">
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 bg-[#0C0C0C] border border-[#222] overflow-hidden rounded-[2px] flex items-center justify-center">
                                        {item.image_url ? (
                                            <img src={item.image_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <Image className="text-[#333]" size={24} />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[18px]">{item.label || item.title || item.name}</h3>
                                        <p className="text-[#686868] text-[14px] line-clamp-1 max-w-[400px]">{item.value || item.category || item.role || item.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleEdit(item)} className="p-2 text-[#A0A0A0] hover:text-[#FF4D00]"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(item.id)} className="p-2 text-[#A0A0A0] hover:text-[#FF4D00]"><Trash2 size={18} /></button>
                                </div>
                            </div>
                        ))}
                        {data.length === 0 && (
                            <div className="py-20 text-center border-2 border-dashed border-[#222] text-[#555] rounded-[8px]">
                                Empty space. Click "Add New" to build your agency.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => !isSaving && setIsModalOpen(false)}></div>
                    <div className="relative w-full max-w-[600px] bg-[#141414] border border-[#1C1C1C] p-8 rounded-[8px] animate-in fade-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                        <h3 className="font-[SpaceGrotesk] font-bold text-[24px] mb-6 uppercase">
                            {editingId ? 'Edit' : 'Add'} {activeTab === 'services' ? 'Service' : activeTab === 'portfolio' ? 'Project' : activeTab === 'tools' ? 'Tool' : 'Member'}
                        </h3>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">
                                    {activeTab === 'services' ? 'Service Title' : activeTab === 'portfolio' ? 'Project Title' : activeTab === 'tools' ? 'Tool Name (e.g. Figma)' : 'Full Name'}
                                </label>
                                <input
                                    required
                                    className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                    value={newItem.label}
                                    onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                                />
                            </div>

                            {activeTab !== 'tools' && (
                                <div className="space-y-2">
                                    <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">
                                        {activeTab === 'services' ? 'Description' : activeTab === 'portfolio' ? 'Category' : 'Role'}
                                    </label>
                                    {activeTab === 'portfolio' ? (
                                        <select
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors text-white"
                                            value={newItem.value}
                                            onChange={e => setNewItem({ ...newItem, value: e.target.value })}
                                        >
                                            <option value="" disabled>Select Category</option>
                                            <option value="Graphic Design">Graphic Design</option>
                                            <option value="Logo">Logo</option>
                                            <option value="Thumbnails">Thumbnails</option>
                                            <option value="Video">Video</option>
                                            <option value="Web">Web</option>
                                        </select>
                                    ) : activeTab === 'services' ? (
                                        <div className="space-y-4">
                                            <p className="text-[12px] text-[#666]">Select which service mockup you are updating:</p>
                                            <select
                                                required
                                                className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors text-white"
                                                value={newItem.label}
                                                onChange={e => setNewItem({ ...newItem, label: e.target.value })}
                                            >
                                                <option value="" disabled>Select Service</option>
                                                <option value="graphic-design">Graphic Design</option>
                                                <option value="logo-design">Logo & Identity</option>
                                                <option value="thumbnail-design">Thumbnail Engine</option>
                                                <option value="video-editing">Video Editing</option>
                                                <option value="web-design">Website Design</option>
                                            </select>
                                        </div>
                                    ) : (
                                        <input
                                            required
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                            value={newItem.value}
                                            onChange={e => setNewItem({ ...newItem, value: e.target.value })}
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === 'services' && (
                                <div className="space-y-2">
                                    <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">Service Mockup (Image)</label>
                                    <input
                                        type="file"
                                        required={!editingId}
                                        accept="image/*,video/*"
                                        className="w-full text-sm text-[#A0A0A0] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1C1C1C] file:text-[#FF4D00] hover:file:bg-[#222]"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0];
                                            if (file && file.size > MAX_FILE_SIZE) {
                                                setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max allowed is 50MB.`);
                                                e.target.value = '';
                                                return;
                                            }
                                            setNewItem({ ...newItem, file: file || null });
                                        }}
                                    />
                                    {editingId && !newItem.file && <p className="text-[10px] text-[#555]">Leave empty to keep current mockup.</p>}
                                </div>
                            )}

                            {activeTab === 'team' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold flex items-center"><Linkedin size={14} className="mr-1" /> LinkedIn</label>
                                        <input
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                            value={newItem.linkedin}
                                            onChange={e => setNewItem({ ...newItem, linkedin: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold flex items-center"><Instagram size={14} className="mr-1" /> Instagram</label>
                                        <input
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                            value={newItem.instagram}
                                            onChange={e => setNewItem({ ...newItem, instagram: e.target.value })}
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'portfolio' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">Client</label>
                                        <input
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                            value={newItem.client}
                                            onChange={e => setNewItem({ ...newItem, client: e.target.value })}
                                            placeholder="Brand Name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">Year</label>
                                        <input
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors"
                                            value={newItem.year}
                                            onChange={e => setNewItem({ ...newItem, year: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">Display Location</label>
                                        <select
                                            className="w-full bg-[#0C0C0C] border border-[#222] p-4 focus:border-[#FF4D00] outline-none transition-colors text-white"
                                            value={newItem.display_location}
                                            onChange={e => setNewItem({ ...newItem, display_location: e.target.value })}
                                        >
                                            <option value="portfolio">Portfolio Page Only</option>
                                            <option value="home">Home Page Only</option>
                                            <option value="both">Both Pages</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {activeTab !== 'services' && (
                                <div className="space-y-2">
                                    <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">
                                        {activeTab === 'portfolio' ? 'Project Thumbnail' : activeTab === 'tools' ? 'Tool Icon (Image/SVG)' : 'Profile Image'}
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        className="w-full text-sm text-[#A0A0A0] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1C1C1C] file:text-[#FF4D00] hover:file:bg-[#222]"
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                            const file = e.target.files?.[0];
                                            if (file && file.size > MAX_FILE_SIZE) {
                                                setError(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max allowed is 50MB.`);
                                                e.target.value = '';
                                                return;
                                            }
                                            setNewItem({ ...newItem, file: file || null });
                                        }}
                                    />
                                    {editingId && !newItem.file && <p className="text-[10px] text-[#555]">Leave empty to keep current asset.</p>}
                                </div>
                            )}

                            {activeTab === 'portfolio' && (
                                <div className="space-y-2">
                                    <label className="text-[12px] uppercase tracking-wider text-[#555] font-bold">Add to Showcase Gallery (Multi-upload)</label>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*,video/*"
                                        className="w-full text-sm text-[#A0A0A0] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#1C1C1C] file:text-[#FF4D00] hover:file:bg-[#222]"
                                        onChange={e => {
                                            const files = Array.from(e.target.files || []);
                                            const oversized = files.find(f => f.size > MAX_FILE_SIZE);
                                            if (oversized) {
                                                setError(`One or more files exceed the 50MB limit (${oversized.name}).`);
                                                e.target.value = '';
                                                return;
                                            }
                                            setNewItem({ ...newItem, galleryFiles: files });
                                        }}
                                    />
                                </div>
                            )}

                            <div className="flex space-x-4 pt-4">
                                <Button type="submit" className="flex-1" disabled={isSaving}>
                                    {isSaving ? 'Synchronizing...' : editingId ? 'Update Content' : 'Save Creation'}
                                </Button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 text-[#A0A0A0] hover:text-white uppercase text-[12px] font-bold"
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
