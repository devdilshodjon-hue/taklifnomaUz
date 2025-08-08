import { Link } from "react-router-dom";
import { useState } from "react";
import { Sparkles, ArrowLeft, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { weddingTemplates, templateCategories, getTemplatesByCategory, type TemplateData } from "@/lib/templates";
import TemplateRenderer from "@/components/TemplateRenderer";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredTemplates, setFilteredTemplates] = useState<TemplateData[]>(weddingTemplates);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Template kategoriya filter
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === 'all') {
      setFilteredTemplates(weddingTemplates);
    } else {
      const filtered = getTemplatesByCategory(categoryId);
      setFilteredTemplates(filtered);
    }
  };

  // Template preview
  const handlePreviewTemplate = (template: TemplateData) => {
    setPreviewTemplate(template);
    setShowPreview(true);
  };

  // Mock invitation data for preview
  const getMockInvitationData = (template: TemplateData) => ({
    id: 'preview',
    groom_name: 'Jahongir',
    bride_name: 'Sarvinoz', 
    wedding_date: '2024-06-15',
    wedding_time: '16:00',
    venue: 'Atirgul Bog\'i',
    address: 'Toshkent sh., Yunusobod t., Bog\' ko\'chasi 123',
    city: 'Toshkent',
    custom_message: 'Bizning sevgi va baxt to\'la kunimizni birga nishonlash uchun sizni taklif qilamiz.',
    template_id: template.id
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border p-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Bosh sahifaga qaytish
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading text-xl font-bold text-foreground">TaklifNoma</span>
            </div>
          </div>
          <Button asChild className="button-modern">
            <Link to="/create">
              Taklifnoma Yaratish
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4">
            Taklifnoma Shablonlari
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Har qanday uslub uchun chiroyli dizaynlar. Shablonni tanlang va o'zingizning maxsus kuningiz uchun moslang.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            {templateCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => handleCategoryChange(category.id)}
                className="font-medium"
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="group card-modern p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Template Preview */}
              <div className="aspect-[3/4] mb-4 rounded-lg overflow-hidden border-2 border-border relative"
                   style={{ backgroundColor: template.colors.background }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl mb-2">{template.preview}</div>
                    <div className="px-4">
                      <h3 className="text-lg font-bold mb-1" style={{ color: template.colors.primary }}>
                        Jahongir & Sarvinoz
                      </h3>
                      <p className="text-sm opacity-75" style={{ color: template.colors.text }}>
                        15 Iyun 2024
                      </p>
                      <p className="text-xs mt-2 opacity-60" style={{ color: template.colors.text }}>
                        Atirgul Bog'i
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    onClick={() => handlePreviewTemplate(template)}
                    className="bg-white text-black hover:bg-gray-100"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    To'liq Ko'rish
                  </Button>
                </div>
              </div>

              {/* Template Info */}
              <div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
                  {template.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {template.description}
                </p>

                {/* Color Palette */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-muted-foreground">Ranglar:</span>
                  <div className="flex gap-1">
                    <div className="w-4 h-4 rounded-full border border-border" 
                         style={{ backgroundColor: template.colors.primary }}></div>
                    <div className="w-4 h-4 rounded-full border border-border" 
                         style={{ backgroundColor: template.colors.accent }}></div>
                    <div className="w-4 h-4 rounded-full border border-border" 
                         style={{ backgroundColor: template.colors.secondary }}></div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePreviewTemplate(template)}
                    className="flex-1"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ko'rish
                  </Button>
                  <Button asChild className="flex-1">
                    <Link to="/create" state={{ selectedTemplate: template.id }}>
                      Tanlash
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h2 className="font-heading text-3xl font-bold text-foreground mb-4">
            O'zingizning taklifnomangizni yaratishga tayyormisiz?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Yuqoridagi shablonlardan birini tanlab, bir necha daqiqada chiroyli taklifnoma yarating.
          </p>
          <Button size="lg" asChild className="primary-gradient px-8 py-4 text-lg rounded-xl">
            <Link to="/create">
              Hoziroq Boshlash
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Template Preview Modal */}
      {showPreview && previewTemplate && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="bg-card rounded-2xl shadow-2xl border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-heading text-xl font-bold text-foreground">
                      {previewTemplate.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {previewTemplate.description}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild>
                      <Link to="/create" state={{ selectedTemplate: previewTemplate.id }}>
                        Bu Shablonni Tanlash
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setShowPreview(false)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <TemplateRenderer 
                  invitation={getMockInvitationData(previewTemplate)}
                  guestName="Hurmatli Mehmon"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
