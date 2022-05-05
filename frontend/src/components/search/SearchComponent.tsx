import React, { useState, useEffect } from 'react';
import {
  generatePath,
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

// Components
import Feed from '../../components/Feed';
import HotQuestions from '../../components/HotQuestions';

// Data
import API from '../../data/FrontendAPI';

// Utils
import { QuestionPost, SearchScope } from '../../utils/Types';

const SearchComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchResults, setSearchResults] = useState<QuestionPost[]>([]);
  const [searchQuery, setSearchQuery] = useState<string | null>();
  const [searchScope, setSearchScope] = useState<SearchScope>(SearchScope.Full);

  const [spellingSuggestions, setSpellingSuggestions] = useState<string[]>([]);

  function getEnumFromString<T>(type: T, str: string): any {
    const enumName = (Object.keys(type) as Array<keyof T>).find(
      (k) => (type as any)[k].toLowerCase() === str.toLowerCase()
    ) as keyof T;
    var keyValue = isNaN(Number(enumName)) ? enumName : Number(enumName);
    return keyValue;
  }

  useEffect(() => {
    // TODO: - Fix params

    const scope = searchParams.get('scope') as keyof typeof SearchScope;

    setSearchQuery(searchParams.get('q'));
    setSearchScope(
      getEnumFromString(SearchScope, scope).toLowerCase() || 'full'
    );
  }, [searchParams]);

  useEffect(() => {
    if (searchQuery) {
      API.Search.search(searchQuery, searchScope).then((results) => {
        // Trim body to show searchQuery in answer body
        const cutoff = 200;

        results.forEach((result) => {
          if (result.answers) {
            result.answers.forEach((answer) => {
              const keywordIndex = answer.body.indexOf(searchQuery);

              if (keywordIndex > 200 && answer.body.length > cutoff) {
                return (answer.body =
                  '...' +
                  answer.body.substring(answer.body.indexOf(searchQuery) - 50));
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
      console.log(searchScope);
      return (
        <div className={'spelling-suggestions'}>
          <h4>Did you mean:</h4>
          <ul>
            {spellingSuggestions.map((suggestion, i) => {
              return (
                <li key={i}>
                  <Link
                    to={generatePath('/search?q=:q&scope=:scope', {
                      q: suggestion,
                      scope: searchScope,
                    })}
                  >
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
