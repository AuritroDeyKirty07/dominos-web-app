import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Pizza, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-24 h-24 rounded-3xl bg-dominos-red/10 text-dominos-red flex items-center justify-center mx-auto shadow-inner">
        <Pizza className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-black uppercase text-dominos-red tracking-widest">
          Error 404
        </span>
        <h1 className="text-4xl font-black font-brand text-slate-900">
          WHOOPS! THIS SLICE IS MISSING
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          The page you're looking for might have been eaten or doesn't exist anymore. Let's get you back to delicious pizzas!
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          variant="danger"
          size="lg"
          onClick={() => navigate('/menu')}
          className="w-full sm:w-auto font-brand"
        >
          <span>Explore Menu</span>
        </Button>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/')}
          className="w-full sm:w-auto"
        >
          <Home className="w-4 h-4 mr-2" />
          <span>Go to Home</span>
        </Button>
      </div>
    </div>
  );
};
