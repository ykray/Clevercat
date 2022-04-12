import React, { useEffect, useState, useRef } from 'react';
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

// Assets
import styles from '../assets/sass/_variables.scss';

// MUI
import {
  Chip,
  IconButton,
  InputAdornment,
  TextField,
  Stack,
  Slide,
  Tooltip,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import { SearchScope } from '../utils/Types';
import { Check as CheckIcon } from '@mui/icons-material';

export default function SearchBar() {
  const navigate = useNavigate();
  const inputRef = useRef<any>(null);
  const containerRef = useRef(null);

  // States
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scopeQuestions, setScopeQuestions] = useState(false);
  const [scopeAnswers, setScopeAnswers] = useState(false);
  const [searchScope, setSearchScope] = useState<SearchScope>(SearchScope.Full);
  const [placeholder, setPlaceholder] = useState<string>(
    'Search questions & answers...'
  );
  const [slideIn, setSlideIn] = useState(false);
  const [searchBarFocus, setSearchBarFocus] = useState(false);

  useEffect(() => {
    // TODO: - Fix params
    setSearchQuery(searchParams.get('q') ?? '');
    setSearchScope(searchParams.get('scope') as SearchScope);
  }, [searchParams]);

  useEffect(() => {
    setSearchParams({ q: searchQuery, scope: searchScope });
    if (scopeQuestions && scopeAnswers) {
      setSearchScope(SearchScope.Full);
    } else if (scopeQuestions) {
      setSearchScope(SearchScope.Questions);
    } else if (scopeAnswers) {
      setSearchScope(SearchScope.Answers);
    } else {
      // Default: full text search
      setSearchScope(SearchScope.Full);
    }
  }, [scopeQuestions, scopeAnswers]);

  useEffect(() => {
    switch (searchScope) {
      case SearchScope.Questions:
        setPlaceholder('Search questions');
        break;
      case SearchScope.Answers:
        setPlaceholder('Search answers');
        break;
      default:
        setPlaceholder('Search questions and answers');
        break;
    }
  }, [searchScope]);

  useEffect(() => {
    if (searchBarFocus) {
      setTimeout(() => {
        setSlideIn(true);
      }, 130);
    }
  }, [searchBarFocus]);

  useEffect(() => {
    if (!slideIn) {
      setTimeout(() => {
        setSearchBarFocus(false);
      }, 150);
    }
  }, [slideIn]);

  const handleSearch = () => {
    navigate({
      pathname: 'search',
      search: createSearchParams({
        q: searchQuery,
        scope: searchScope,
      }).toString(),
    });
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  return (
    <Stack spacing={0}>
      <TextField
        focused={searchBarFocus}
        inputRef={inputRef}
        className={`search-bar`}
        placeholder={placeholder}
        value={searchQuery}
        autoComplete={'off'}
        onFocus={() => {
          setSearchBarFocus(true);
        }}
        onBlur={() => {
          setSlideIn(false);
        }}
        onChange={handleChange}
        // onBlur={() => setSearchQuery('')}
        onKeyDown={(e) => {
          // Handle "Enter" key press
          if (e.key === 'Enter') {
            handleSearch();
          }
        }}
        InputProps={{
          startAdornment: <SearchIcon className={'search-icon'} />,
          endAdornment: (
            <InputAdornment position="start">
              {searchQuery ? (
                <Tooltip title={'Clear'} placement={'bottom'} arrow>
                  <IconButton
                    disableRipple
                    onClick={() => setSearchQuery('')}
                    style={{
                      color: searchQuery ? styles.color_primary_500 : '',
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </InputAdornment>
          ),
        }}
        // fullWidth
        style={{ position: 'relative', width: searchBarFocus ? '100%' : '' }}
      />
      <div className={'search-scope'} ref={containerRef}>
        <Slide
          timeout={{ enter: 50, exit: 120 }}
          direction={'down'}
          in={slideIn}
          container={containerRef.current}
        >
          <div>
            <Stack direction={'row'} justifyContent={'flex-end'} spacing={1}>
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <Chip
                  label="Questions"
                  variant="outlined"
                  onClick={() => {
                    setScopeQuestions(!scopeQuestions);
                    if (inputRef.current) {
                      inputRef.current.unbind('blur');
                    }
                  }}
                  icon={
                    scopeQuestions ? (
                      <CheckIcon
                        style={{
                          width: 16,
                          height: 16,
                          color: 'white',
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  style={{
                    color: scopeQuestions ? 'white' : '',
                    backgroundColor: scopeQuestions
                      ? styles.color_primary_500
                      : '',
                    borderColor: scopeQuestions ? styles.color_primary_500 : '',
                  }}
                />
              </div>
              <div
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
              >
                <Chip
                  label="Answers"
                  variant="outlined"
                  onClick={() => {
                    setScopeAnswers(!scopeAnswers);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  icon={
                    scopeAnswers ? (
                      <CheckIcon
                        style={{
                          width: 16,
                          height: 16,
                          color: 'white',
                        }}
                      />
                    ) : (
                      <></>
                    )
                  }
                  style={{
                    color: scopeAnswers ? 'white' : styles.color_text,
                    backgroundColor: scopeAnswers
                      ? styles.color_primary_500
                      : '',
                    borderColor: scopeAnswers ? styles.color_primary_500 : '',
                  }}
                />
              </div>
            </Stack>
          </div>
        </Slide>
      </div>
    </Stack>
  );
}
