import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Components
import Feed from './Feed';

// Data
import API from '../data/FrontendAPI';
import { QuestionPost, SearchScope } from '../utils/Types';
import HotQuestions from './HotQuestions';

const SearchComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<QuestionPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>();
  const [searchScope, setSearchScope] = useState<SearchScope>(SearchScope.Full);

  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);

  useEffect(() => {
    // TODO: - Fix params
    setSearchQuery(searchParams.get('q'));
    setSearchScope(searchParams.get('scope') as SearchScope);
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery) {
      API.Search.search(searchQuery, searchScope).then((results) => {
        // Trim body to show searchQuery in answer body
        const cutoff = 200;

        results.map((result) => {
          if (result.answers) {
            result.answers.map((answer) => {
              const keywordIndex = answer.body.indexOf(searchQuery);

              if (keywordIndex > 200 && answer.body.length > cutoff) {
                return (answer.body =
                  '...' +
                  answer.body.substring(
                    answer.body.indexOf(searchQuery) - 100
                  ));
              }
            });
          }
        });

        setSearchResults(results);
      });
    }
  }, [searchQuery]);

  useEffect(() => {
    if (searchResults.length === 0 && searchQuery) {
      API.getSpellingSuggestions(searchQuery).then((corrections) => {
        console.log(corrections);
        setSpellingSuggestions(corrections);
      });
    } else {
      setSpellingSuggestions([]);
    }
  }, [searchResults]);

  const renderSpellingSuggestions = () => {
    if (spellingSuggestions && spellingSuggestions.length > 0) {
      return (
        <div className={'spelling-suggestions'}>
          <h4>Did you mean:</h4>
          <ul>
            {spellingSuggestions.map((suggestion, i) => {
              return (
                <li key={i}>
                  <Link to={`/search?q=${suggestion}&?scope=${searchScope}`}>
                    {suggestion}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      );
    }
  };

  const renderTitle = () => {
    const resultsNum = searchResults?.length || 0;

    const scopeLabel = (): string => {
      var label;
      switch (searchScope) {
        case SearchScope.Questions:
          label = 'question';
          break;
        case SearchScope.Answers:
          label = 'answer';
          break;
        default:
          label = 'result';
          break;
      }
      return label + (resultsNum === 0 ? 's' : resultsNum > 1 ? 's' : '');
    };

    const scopeVerb = () => {
      var verb;
      switch (searchScope) {
        case SearchScope.Questions:
          verb = 'about';
          break;
        case SearchScope.Answers:
          verb = 'about';
          break;
        default:
          verb = 'for';
          break;
      }
      return verb;
    };

    switch (resultsNum) {
      case 0:
        return `No ${scopeLabel()} ${scopeVerb()} `;
      case 1:
        return `1 ${scopeLabel()} ${scopeVerb()} `;
      default:
        return `${resultsNum} ${scopeLabel()} ${scopeVerb()} `;
    }
  };

  return searchQuery?.length !== 0 ? (
    <div className="search-container">
      <h2>
        {renderTitle()}
        <span className={'search-query-highlight'}>{searchQuery}</span>
      </h2>
      {renderSpellingSuggestions()}
      <Feed posts={searchResults} searchQuery={searchQuery} />
    </div>
  ) : (
    <HotQuestions />
  );
};

export default SearchComponent;
