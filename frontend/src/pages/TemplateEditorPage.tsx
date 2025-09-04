import React, { useRef } from 'react';
import EmailEditor, { EditorRef } from 'react-email-editor';
import { Button } from '@components/atoms/Button';

export const TemplateEditorPage: React.FC = () => {
  const editorRef = useRef<EditorRef>(null);

  const exportHtml = () => {
    editorRef.current?.editor?.exportHtml((data:any)=>{
      const { html } = data;
      console.log('HTML OUTPUT', html);
      alert('Template HTML length: ' + html.length);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Template Editor</h2>
        <Button type="button" onClick={exportHtml}>Export HTML</Button>
      </div>
      <div className="h-[600px] border border-gray-200 dark:border-gray-800 rounded overflow-hidden bg-white dark:bg-gray-900">
        <EmailEditor ref={editorRef} minHeight="100%" appearance={{ theme: 'dark', panels: { tools: { dock: 'left' }}}} />
      </div>
    </div>
  );
};

export default TemplateEditorPage;
