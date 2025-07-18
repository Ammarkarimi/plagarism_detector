
import React, { useState } from 'react';
import { Upload, FileCode2, Shield, AlertTriangle, CheckCircle, Zap, Brain, Hash } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';

interface AnalysisResult {
  normalized_hash_similarity: number;
  ast_similarity: number;
  verdict: string;
}

const Index = () => {
  const [file1, setFile1] = useState<File | null>(null);
  const [file2, setFile2] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (file: File, slot: 1 | 2) => {
    if (slot === 1) {
      setFile1(file);
    } else {
      setFile2(file);
    }
    setResult(null);
  };

  const handleDrop = (e: React.DragEvent, slot: 1 | 2) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const file = files[0];
    if (file && (file.name.endsWith('.py') || file.name.endsWith('.js') || file.name.endsWith('.java') || file.name.endsWith('.cpp'))) {
      handleFileUpload(file, slot);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a code file (.py, .js, .java, .cpp)",
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const analyzeFiles = async () => {
    if (!file1 || !file2) {
      toast({
        title: "Missing files",
        description: "Please upload both code files to analyze",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setProgress(0);

    const formData = new FormData();
    formData.append('file1', file1);
    formData.append('file2', file2);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      const response = await fetch('http://localhost:8000/check-plagiarism', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze files');
      }

      const data = await response.json();
      setResult(data);
      setProgress(100);
      
      toast({
        title: "Analysis Complete",
        description: `Verdict: ${data.verdict}`,
        variant: data.verdict === "Plagiarized" ? "destructive" : "default"
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not connect to the plagiarism detection service. Make sure the backend is running.",
        variant: "destructive"
      });
      console.error('Error:', error);
    } finally {
      setIsAnalyzing(false);
      clearInterval(progressInterval);
    }
  };

  const getVerdictColor = (verdict: string) => {
    return verdict === "Plagiarized" ? "text-red-400" : "text-green-400";
  };

  const getVerdictIcon = (verdict: string) => {
    return verdict === "Plagiarized" ? AlertTriangle : CheckCircle;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Code Plagiarism Detector
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Advanced forensic analysis using AST comparison and hash-based similarity detection
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* File 1 Upload */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div
              className="p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-cyan-400 transition-all duration-300 cursor-pointer group"
              onDrop={(e) => handleDrop(e, 1)}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file1')?.click()}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FileCode2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Source Code #1</h3>
                {file1 ? (
                  <div className="text-cyan-400 font-medium">{file1.name}</div>
                ) : (
                  <div className="text-gray-400">Drop code file here or click to browse</div>
                )}
                <input
                  id="file1"
                  type="file"
                  accept=".py,.js,.java,.cpp,.c,.php,.rb,.go,.rs"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 1)}
                />
              </div>
            </div>
          </Card>

          {/* File 2 Upload */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <div
              className="p-8 border-2 border-dashed border-slate-600 rounded-lg hover:border-purple-400 transition-all duration-300 cursor-pointer group"
              onDrop={(e) => handleDrop(e, 2)}
              onDragOver={handleDragOver}
              onClick={() => document.getElementById('file2')?.click()}
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FileCode2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Source Code #2</h3>
                {file2 ? (
                  <div className="text-purple-400 font-medium">{file2.name}</div>
                ) : (
                  <div className="text-gray-400">Drop code file here or click to browse</div>
                )}
                <input
                  id="file2"
                  type="file"
                  accept=".py,.js,.java,.cpp,.c,.php,.rb,.go,.rs"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 2)}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Analyze Button */}
        <div className="text-center mb-12">
          <Button
            onClick={analyzeFiles}
            disabled={!file1 || !file2 || isAnalyzing}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-12 py-6 text-xl font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Zap className="w-6 h-6 mr-3 animate-pulse" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="w-6 h-6 mr-3" />
                Analyze Code Similarity
              </>
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        {isAnalyzing && (
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6 mb-8">
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">Deep Analysis in Progress</h3>
              <p className="text-gray-400">Parsing AST structures and computing similarity hashes...</p>
            </div>
            <Progress value={progress} className="w-full h-3" />
            <div className="text-center mt-2 text-sm text-gray-400">{Math.round(progress)}% Complete</div>
          </Card>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-8">
            {/* Verdict Card */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-8">
              <div className="text-center">
                <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 ${
                  result.verdict === "Plagiarized" 
                    ? "bg-red-500/20 text-red-400" 
                    : "bg-green-500/20 text-green-400"
                }`}>
                  {React.createElement(getVerdictIcon(result.verdict), { className: "w-10 h-10" })}
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  <span className={getVerdictColor(result.verdict)}>
                    {result.verdict}
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">
                  Analysis complete - detailed breakdown below
                </p>
              </div>
            </Card>

            {/* Detailed Analysis */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Hash Similarity */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                    <Hash className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Hash Similarity</h3>
                    <p className="text-gray-400 text-sm">Token-based k-gram analysis</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">
                    {result.normalized_hash_similarity}%
                  </div>
                  <Progress 
                    value={result.normalized_hash_similarity} 
                    className="w-full h-2"
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Measures structural similarity using rolling hash functions on normalized code tokens
                </p>
              </Card>

              {/* AST Similarity */}
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">AST Similarity</h3>
                    <p className="text-gray-400 text-sm">Abstract syntax tree comparison</p>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {result.ast_similarity}%
                  </div>
                  <Progress 
                    value={result.ast_similarity} 
                    className="w-full h-2"
                  />
                </div>
                <p className="text-gray-400 text-sm">
                  Analyzes the underlying program structure independent of surface-level changes
                </p>
              </Card>
            </div>

            {/* Thresholds Info */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Detection Thresholds</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-white font-medium">Plagiarism Detected</span>
                  </div>
                  <ul className="text-gray-400 space-y-1 ml-5">
                    <li>• Hash similarity &gt; 60%</li>
                    <li>• AST similarity &gt; 70%</li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-white font-medium">Likely Original</span>
                  </div>
                  <ul className="text-gray-400 space-y-1 ml-5">
                    <li>• Hash similarity ≤ 60%</li>
                    <li>• AST similarity ≤ 70%</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
