import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bold,
  Underline,
  Italic,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Code,
  Table,
  Minus,
  HelpCircle,
  ChevronDown,
  Type,
  Palette,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [fontFamily, setFontFamily] = useState("Roboto");
  const [textColor, setTextColor] = useState("#000000");

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleFontChange = (font: string) => {
    setFontFamily(font);
    execCommand("fontName", font);
  };

  const handleColorChange = (color: string) => {
    setTextColor(color);
    execCommand("foreColor", color);
  };

  const colors = [
    "#000000", "#434343", "#666666", "#999999", "#B7B7B7", "#CCCCCC", "#D9D9D9", "#EFEFEF", "#F3F3F3", "#FFFFFF",
    "#980000", "#FF0000", "#FF9900", "#FFFF00", "#00FF00", "#00FFFF", "#4A86E8", "#0000FF", "#9900FF", "#FF00FF",
    "#E6B8AF", "#F4CCCC", "#FCE5CD", "#FFF2CC", "#D9EAD3", "#D0E0E3", "#C9DAF8", "#CFE2F3", "#D9D2E9", "#EAD1DC",
  ];

  return (
    <div className="border border-input rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-input">
        {/* Font Style Dropdown */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Type className="w-4 h-4 mr-1" />
              <ChevronDown className="w-3 h-3" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-1">
            <div className="space-y-1">
              {["Normal", "Heading 1", "Heading 2", "Heading 3"].map((style) => (
                <Button
                  key={style}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    if (style === "Normal") execCommand("formatBlock", "p");
                    else if (style === "Heading 1") execCommand("formatBlock", "h1");
                    else if (style === "Heading 2") execCommand("formatBlock", "h2");
                    else if (style === "Heading 3") execCommand("formatBlock", "h3");
                  }}
                >
                  {style}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")}>
          <Bold className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("underline")}>
          <Underline className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")}>
          <Italic className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Font Family */}
        <Select value={fontFamily} onValueChange={handleFontChange}>
          <SelectTrigger className="h-8 w-24 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Roboto">Roboto</SelectItem>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Times New Roman">Times</SelectItem>
            <SelectItem value="Courier New">Courier</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6 mx-1" />

        {/* Text Color */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Palette className="w-4 h-4" />
              <div
                className="w-4 h-1 ml-1"
                style={{ backgroundColor: textColor }}
              />
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2">
            <div className="grid grid-cols-10 gap-1">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-5 h-5 rounded border border-input hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertUnorderedList")}>
          <List className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertOrderedList")}>
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyLeft")}>
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyCenter")}>
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyRight")}>
          <AlignRight className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt("Enter table size (e.g., 3x3):");
            if (url) {
              const [rows, cols] = url.split("x").map(Number);
              if (rows && cols) {
                let table = "<table border='1' style='border-collapse: collapse; width: 100%;'>";
                for (let i = 0; i < rows; i++) {
                  table += "<tr>";
                  for (let j = 0; j < cols; j++) {
                    table += "<td style='padding: 8px; border: 1px solid #ccc;'>&nbsp;</td>";
                  }
                  table += "</tr>";
                }
                table += "</table>";
                execCommand("insertHTML", table);
              }
            }
          }}
        >
          <Table className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCommand("createLink", url);
          }}
        >
          <Link className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            const url = prompt("Enter image URL:");
            if (url) execCommand("insertImage", url);
          }}
        >
          <Image className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("insertHorizontalRule")}>
          <Minus className="w-4 h-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => execCommand("formatBlock", "pre")}
        >
          <Code className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[150px] p-3 focus:outline-none"
        onInput={updateValue}
        onBlur={updateValue}
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
