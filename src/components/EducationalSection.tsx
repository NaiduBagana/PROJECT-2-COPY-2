import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, ArrowLeft, Brain, Eye, Cpu, Shield } from 'lucide-react';

const EducationalSection: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<string | null>('what');
  
  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-16">
      <div className="cyber-panel max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-2 cyber-text-glow text-center">
          Understanding Deepfakes
        </h1>
        <p className="text-center text-gray-400 mb-12">
          Learn how deepfakes work and how our technology detects them
        </p>
        
        <div className="space-y-6">
          <EducationCard 
            id="what"
            title="What are Deepfakes?"
            icon={<Brain className="w-6 h-6 text-cyber-blue" />}
            isExpanded={expandedSection === 'what'}
            toggleExpand={() => toggleSection('what')}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="mb-4">
                  Deepfakes are synthetic media where a person's likeness is replaced with someone else's using artificial intelligence. The term combines "deep learning" and "fake."
                </p>
                <p className="mb-4">
                  These AI-generated videos or images can make it appear that someone said or did something they never actually did, creating convincing but fabricated content.
                </p>
                <p>
                  Modern deepfakes use sophisticated neural networks called Generative Adversarial Networks (GANs) or more recently, diffusion models, to create increasingly realistic fake media that can be difficult to distinguish from authentic content.
                </p>
              </div>
              <div className="bg-cyber-dark p-4 rounded-lg">
                <h3 className="text-lg font-bold mb-3 cyber-text-glow">Common Types of Deepfakes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue flex items-center justify-center shrink-0 mt-0.5">1</div>
                    <span><strong>Face Swaps:</strong> Replacing one person's face with another in videos or images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue flex items-center justify-center shrink-0 mt-0.5">2</div>
                    <span><strong>Lip Sync:</strong> Manipulating mouth movements to match fabricated audio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue flex items-center justify-center shrink-0 mt-0.5">3</div>
                    <span><strong>Voice Cloning:</strong> Creating synthetic voices that mimic real people</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-blue flex items-center justify-center shrink-0 mt-0.5">4</div>
                    <span><strong>Full Body Puppetry:</strong> Controlling someone's entire body movements</span>
                  </li>
                </ul>
              </div>
            </div>
          </EducationCard>
          
          <EducationCard 
            id="how"
            title="How Deepfakes Are Created"
            icon={<Cpu className="w-6 h-6 text-cyber-pink" />}
            isExpanded={expandedSection === 'how'}
            toggleExpand={() => toggleSection('how')}
          >
            <div className="space-y-6">
              <p>
                Creating deepfakes involves sophisticated AI techniques that have become increasingly accessible. Here's a simplified explanation of the process:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-cyber-dark p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-cyber-pink">1. Data Collection</h3>
                  <p className="text-sm">
                    Gathering hundreds or thousands of images/videos of both the source person (who will be replaced) and the target person (whose likeness will be used).
                  </p>
                </div>
                
                <div className="bg-cyber-dark p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-cyber-pink">2. Training AI Models</h3>
                  <p className="text-sm">
                    Using neural networks (typically GANs or diffusion models) to learn the facial features, expressions, and movements of both individuals.
                  </p>
                </div>
                
                <div className="bg-cyber-dark p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-cyber-pink">3. Synthesis</h3>
                  <p className="text-sm">
                    Generating new media where the AI replaces the source person's face with the target's, matching expressions, lighting, and angle.
                  </p>
                </div>
              </div>
              
              <div className="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-pink/30">
                <h3 className="text-lg font-bold mb-3 text-cyber-pink">Technical Deep Dive: GAN Architecture</h3>
                <p className="mb-3">
                  Generative Adversarial Networks (GANs) consist of two neural networks competing against each other:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-pink flex items-center justify-center shrink-0 mt-0.5">G</div>
                    <div>
                      <strong>Generator:</strong> Creates fake images trying to fool the discriminator
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-cyber-pink flex items-center justify-center shrink-0 mt-0.5">D</div>
                    <div>
                      <strong>Discriminator:</strong> Tries to distinguish between real and fake images
                    </div>
                  </li>
                </ul>
                <p className="mt-3">
                  Through iterative training, the generator becomes increasingly skilled at creating realistic fakes that can fool not only the discriminator but human viewers as well.
                </p>
              </div>
            </div>
          </EducationCard>
          
          <EducationCard 
            id="detect"
            title="How Our Technology Detects Deepfakes"
            icon={<Eye className="w-6 h-6 text-cyber-green" />}
            isExpanded={expandedSection === 'detect'}
            toggleExpand={() => toggleSection('detect')}
          >
            <div className="space-y-6">
              <p>
                Our deepfake detection system uses a multi-layered approach to identify manipulated media with high accuracy. Here are the key techniques we employ:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold mb-3 text-cyber-green">Visual Artifact Detection</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <span><strong>Facial Inconsistencies:</strong> Analyzing unnatural blending, warping, or boundary artifacts around facial regions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <span><strong>Reflection Analysis:</strong> Checking for consistent reflections in eyes, teeth, and other reflective surfaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <span><strong>Texture Examination:</strong> Identifying unnatural skin textures, color patterns, or noise distributions</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold mb-3 text-cyber-green">Temporal Analysis (for Videos)</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">1</div>
                      <span><strong>Motion Consistency:</strong> Tracking unnatural movements or jitter between frames</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">2</div>
                      <span><strong>Physiological Signals:</strong> Analyzing natural biological rhythms like blinking and pulse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-green flex items-center justify-center shrink-0 mt-0.5">3</div>
                      <span><strong>Audio-Visual Sync:</strong> Detecting misalignment between lip movements and speech</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-cyber-dark/50 p-4 rounded-lg border border-cyber-green/30">
                <h3 className="text-lg font-bold mb-3 text-cyber-green">Our AI Architecture</h3>
                <p className="mb-4">
                  We use a convolutional neural network (CNN) combined with recurrent neural networks (RNNs) to analyze both spatial and temporal features. Our model has been trained on a diverse dataset of both authentic and manipulated media.
                </p>
                <div className="timeline-container">
                  <div className="timeline-waveform">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const height = 20 + Math.random() * 60;
                      const isSpike = i % 10 === 0;
                      return (
                        <div 
                          key={i} 
                          className={`timeline-bar ${isSpike ? 'timeline-spike' : ''}`}
                          style={{ height: `${height}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
                <p className="mt-3 text-sm text-gray-400">
                  Example of temporal analysis showing anomaly spikes in a deepfake video
                </p>
              </div>
            </div>
          </EducationCard>
          
          <EducationCard 
            id="protect"
            title="Protecting Yourself from Deepfakes"
            icon={<Shield className="w-6 h-6 text-cyber-yellow" />}
            isExpanded={expandedSection === 'protect'}
            toggleExpand={() => toggleSection('protect')}
          >
            <div className="space-y-4">
              <p>
                As deepfake technology becomes more sophisticated, it's important to know how to protect yourself and verify content you encounter online:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-cyber-dark p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-3 text-cyber-yellow">For Individuals</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Be skeptical of sensational or out-of-character content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Verify information through multiple trusted sources</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Look for official statements or confirmations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Use deepfake detection tools like ours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Be careful about sharing sensitive content online</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-cyber-dark p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-3 text-cyber-yellow">For Organizations</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Implement media verification protocols</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Train employees to recognize potential deepfakes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Establish rapid response procedures for fake content</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Use digital signatures and content provenance solutions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 rounded-full bg-cyber-yellow flex items-center justify-center shrink-0 mt-0.5 text-black font-bold">✓</div>
                      <span>Integrate deepfake detection APIs into content workflows</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="p-4 border border-cyber-yellow/30 rounded-lg">
                <h3 className="text-lg font-bold mb-2 text-cyber-yellow">The Future of Authentication</h3>
                <p>
                  As deepfake technology evolves, so too will verification methods. Content provenance solutions that track media from creation to distribution, cryptographic signatures, and blockchain-based verification are all emerging technologies that will help combat the spread of synthetic media.
                </p>
              </div>
            </div>
          </EducationCard>
        </div>
        
        <div className="mt-12 text-center">
          <button 
            onClick={() => navigate('/')}
            className="cyber-button flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

interface EducationCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  toggleExpand: () => void;
  children: React.ReactNode;
}

const EducationCard: React.FC<EducationCardProps> = ({ 
  id, title, icon, isExpanded, toggleExpand, children 
}) => {
  return (
    <div className="border border-cyber-blue/30 rounded-lg overflow-hidden">
      <button 
        onClick={toggleExpand}
        className="w-full flex items-center justify-between p-4 bg-cyber-dark hover:bg-cyber-dark/70 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyber-black rounded-full">
            {icon}
          </div>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-cyber-blue" />
        ) : (
          <ChevronDown className="w-5 h-5 text-cyber-blue" />
        )}
      </button>
      
      {isExpanded && (
        <div className="p-6 bg-cyber-black/50">
          {children}
        </div>
      )}
    </div>
  );
};

export default EducationalSection;