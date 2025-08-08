import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Clock, Heart, Star, Sparkles, Crown, Flower2, Diamond, Gem } from 'lucide-react';
import { getTemplateById, type TemplateData } from '@/lib/templates';
import { supabase } from '@/lib/supabase';

interface InvitationData {
  id: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  wedding_time?: string;
  venue: string;
  address: string;
  city?: string;
  custom_message?: string;
  template_id: string;
  image_url?: string;
}

interface TemplateRendererProps {
  invitation: InvitationData;
  guestName?: string;
}

const TemplateRenderer: React.FC<TemplateRendererProps> = ({ invitation, guestName }) => {
  const [customTemplate, setCustomTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Try to get built-in template first
  let template = getTemplateById(invitation.template_id);

  useEffect(() => {
    // If no built-in template found, try to load custom template
    if (!template && invitation.template_id) {
      setLoading(true);
      const loadCustomTemplate = async () => {
        try {
          const { data, error } = await supabase
            .from('custom_templates')
            .select('*')
            .eq('id', invitation.template_id)
            .single();

          if (!error && data) {
            // Convert custom template to TemplateData format
            const customTemplateData: TemplateData = {
              id: data.id,
              name: data.name,
              description: data.description || '',
              category: 'custom' as any,
              preview: '🎨',
              colors: data.colors || {
                primary: '#6366f1',
                secondary: '#ec4899',
                accent: '#f59e0b',
                background: '#ffffff',
                text: '#1f2937'
              },
              fonts: data.fonts || {
                heading: 'Playfair Display',
                body: 'Inter',
                accent: 'Dancing Script'
              },
              icon: <Sparkles className="w-5 h-5" />
            };
            setCustomTemplate(customTemplateData);
          }
        } catch (error) {
          console.error('Error loading custom template:', error);
        } finally {
          setLoading(false);
        }
      };

      loadCustomTemplate();
    }
  }, [invitation.template_id, template]);

  // Use custom template if available
  if (customTemplate) {
    template = customTemplate;
  }

  // Fallback to default template
  if (!template) {
    template = getTemplateById('classic-rose') || {
      id: 'default',
      name: 'Default',
      description: 'Default template',
      category: 'classic' as const,
      preview: '💍',
      colors: {
        primary: '#6366f1',
        secondary: '#f3f4f6',
        accent: '#fcd34d',
        background: '#fffbeb',
        text: '#1f2937'
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Inter',
        accent: 'Dancing Script'
      },
      icon: <Heart className="w-5 h-5" />
    };
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  // Template-specific rendering
  switch (template.category) {
    case 'classic':
      return <ClassicTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    case 'custom':
      return <CustomTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    case 'modern':
      return <ModernTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    case 'elegant':
      return <ElegantTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    case 'luxury':
      return <LuxuryTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    case 'rustic':
      return <RusticTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />;
    default:
      return <DefaultTemplate invitation={invitation} guestName={guestName} />;
  }
};

// Classic Template
const ClassicTemplate: React.FC<any> = ({ template, invitation, guestName, formatDate, formatTime }) => (
  <div className="card-modern p-12 relative overflow-hidden" 
       style={{ 
         backgroundColor: template.colors.background,
         fontFamily: template.fonts.body 
       }}>
    {/* Decorative hearts */}
    <div className="absolute top-4 left-4 opacity-20">
      <Heart className="w-8 h-8" style={{ color: template.colors.primary }} />
    </div>
    <div className="absolute top-4 right-4 opacity-20">
      <Heart className="w-8 h-8" style={{ color: template.colors.primary }} />
    </div>
    <div className="absolute bottom-4 left-4 opacity-20">
      <Heart className="w-8 h-8" style={{ color: template.colors.primary }} />
    </div>
    <div className="absolute bottom-4 right-4 opacity-20">
      <Heart className="w-8 h-8" style={{ color: template.colors.primary }} />
    </div>

    <div className="text-center space-y-8">
      <div>
        <p className="text-lg mb-4" style={{ color: template.colors.text, opacity: 0.7 }}>
          To'y marosimimizga taklif qilamiz
        </p>
        <h1 className="text-5xl md:text-6xl font-bold mb-4" 
            style={{ 
              color: template.colors.primary,
              fontFamily: template.fonts.heading 
            }}>
          {invitation.groom_name} & {invitation.bride_name}
        </h1>
        <div className="w-24 h-0.5 mx-auto" style={{ backgroundColor: template.colors.accent }}></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-center gap-3 text-xl" style={{ color: template.colors.text }}>
          <Calendar className="w-6 h-6" style={{ color: template.colors.primary }} />
          <span style={{ fontFamily: template.fonts.heading }}>{formatDate(invitation.wedding_date)}</span>
        </div>
        {invitation.wedding_time && (
          <div className="flex items-center justify-center gap-3 text-xl" style={{ color: template.colors.text }}>
            <Clock className="w-6 h-6" style={{ color: template.colors.primary }} />
            <span style={{ fontFamily: template.fonts.heading }}>{formatTime(invitation.wedding_time)}</span>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-center gap-3 text-xl" style={{ color: template.colors.text }}>
          <MapPin className="w-6 h-6" style={{ color: template.colors.primary }} />
          <span style={{ fontFamily: template.fonts.heading }}>{invitation.venue}</span>
        </div>
        <p style={{ color: template.colors.text, opacity: 0.7 }}>{invitation.address}</p>
        {invitation.city && <p style={{ color: template.colors.text, opacity: 0.7 }}>{invitation.city}</p>}
      </div>

      {invitation.custom_message && (
        <div className="border-t border-b py-8" style={{ borderColor: template.colors.accent + '40' }}>
          <p className="text-lg leading-relaxed italic" style={{ color: template.colors.text }}>
            "{invitation.custom_message}"
          </p>
        </div>
      )}

      {guestName && (
        <div>
          <p style={{ color: template.colors.text, opacity: 0.6 }} className="mb-2">Hurmatli</p>
          <p className="text-2xl" style={{ 
            color: template.colors.primary,
            fontFamily: template.fonts.accent 
          }}>
            {guestName}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Modern Template
const ModernTemplate: React.FC<any> = ({ template, invitation, guestName, formatDate, formatTime }) => (
  <div className="card-modern p-12 relative overflow-hidden" 
       style={{ 
         backgroundColor: template.colors.background,
         fontFamily: template.fonts.body 
       }}>
    {/* Modern geometric shapes */}
    <div className="absolute top-0 right-0 w-32 h-32 opacity-10" 
         style={{ background: `linear-gradient(45deg, ${template.colors.primary}, ${template.colors.accent})` }}>
    </div>

    <div className="space-y-10">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
             style={{ backgroundColor: template.colors.primary }}>
          <Diamond className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4" 
            style={{ 
              color: template.colors.text,
              fontFamily: template.fonts.heading 
            }}>
          {invitation.groom_name} <span style={{ color: template.colors.primary }}>&</span> {invitation.bride_name}
        </h1>
        <p className="text-lg" style={{ color: template.colors.text, opacity: 0.7 }}>
          To'y marosimimizga taklif qilamiz
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 text-center">
        <div className="p-4 rounded-lg" style={{ backgroundColor: template.colors.secondary }}>
          <Calendar className="w-6 h-6 mx-auto mb-2" style={{ color: template.colors.primary }} />
          <p className="text-sm font-medium" style={{ color: template.colors.text }}>
            {formatDate(invitation.wedding_date)}
          </p>
        </div>
        
        {invitation.wedding_time && (
          <div className="p-4 rounded-lg" style={{ backgroundColor: template.colors.secondary }}>
            <Clock className="w-6 h-6 mx-auto mb-2" style={{ color: template.colors.primary }} />
            <p className="text-sm font-medium" style={{ color: template.colors.text }}>
              {formatTime(invitation.wedding_time)}
            </p>
          </div>
        )}
        
        <div className="p-4 rounded-lg" style={{ backgroundColor: template.colors.secondary }}>
          <MapPin className="w-6 h-6 mx-auto mb-2" style={{ color: template.colors.primary }} />
          <p className="text-sm font-medium" style={{ color: template.colors.text }}>
            {invitation.venue}
          </p>
        </div>
      </div>

      {invitation.custom_message && (
        <div className="text-center p-6 rounded-lg" style={{ backgroundColor: template.colors.secondary }}>
          <p className="text-lg" style={{ color: template.colors.text }}>
            {invitation.custom_message}
          </p>
        </div>
      )}

      {guestName && (
        <div className="text-center">
          <p className="text-lg" style={{ 
            color: template.colors.primary,
            fontFamily: template.fonts.heading 
          }}>
            Hurmatli {guestName}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Elegant, Luxury, Rustic templates shunga o'xshash tarzda yaratiladi...
const ElegantTemplate: React.FC<any> = ({ template, invitation, guestName, formatDate, formatTime }) => (
  <ClassicTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />
);

const LuxuryTemplate: React.FC<any> = ({ template, invitation, guestName, formatDate, formatTime }) => (
  <ModernTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />
);

const RusticTemplate: React.FC<any> = ({ template, invitation, guestName, formatDate, formatTime }) => (
  <ClassicTemplate template={template} invitation={invitation} guestName={guestName} formatDate={formatDate} formatTime={formatTime} />
);

// Default fallback template
const DefaultTemplate: React.FC<any> = ({ invitation, guestName }) => (
  <div className="card-modern p-12 text-center">
    <h1 className="text-4xl font-bold mb-4">
      {invitation.groom_name} & {invitation.bride_name}
    </h1>
    <p className="text-lg mb-6">To'y marosimimizga taklif qilamiz</p>
    <div className="space-y-2">
      <p>{new Date(invitation.wedding_date).toLocaleDateString('uz-UZ')}</p>
      <p>{invitation.venue}</p>
      <p>{invitation.address}</p>
    </div>
    {guestName && <p className="mt-4 text-lg font-medium">Hurmatli {guestName}</p>}
  </div>
);

export default TemplateRenderer;
