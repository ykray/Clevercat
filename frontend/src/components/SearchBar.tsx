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
import { Search as SearchIcon, Close as ClearIcon } from '@mui/icons-material';
import { SearchQuery, SearchScope } from '../utils/Types';
import { Check as CheckIcon } from '@mui/icons-material';

type Props = {
  mobile?: boolean;
};

export default function SearchBar({ mobile = false }: Props) {
  const navigate = useNavigate();
  const inputRef = useRef<any>(null);
  const containerRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

  // States
  const [searchQuery, setSearchQuery] = useState<SearchQuery>({
    query: '',
    scope: SearchScope.Full,
  });
  const [scopingQuestions, setScopingQuestions] = useState<boolean>(false);
  const [scopingAnswers, setScopingAnswers] = useState<boolean>(false);
  const [placeholder, setPlaceholder] = useState<string>(
    'Search questions & answers...'
  );
  const [slideIn, setSlideIn] = useState(false);
  const [searchBarFocus, setSearchBarFocus] = useState(false);

  useEffect(() => {
    // TODO: - Fix params
    const query = searchParams.get('q') ?? '';
    const scope =
      (searchParams.get('scope') ?? 'full') === 'questions'
        ? SearchScope.Questions
        : (searchParams.get('scope') ?? 'full') === 'answers'
        ? SearchScope.Answers
        : SearchScope.Full;

    setSearchQuery({
      query,
      scope: scope,
    });
  }, [searchParams]);

  useEffect(() => {
    if (scopingQuestions && scopingAnswers) {
      setSearchQuery({ ...searchQuery, scope: SearchScope.Full });
    } else if (scopingQuestions) {
      setSearchQuery({ ...searchQuery, scope: SearchScope.Questions });
    } else if (scopingAnswers) {
      setSearchQuery({ ...searchQuery, scope: SearchScope.Answers });
    } else {
      // Default: full text search
      setSearchQuery({ ...searchQuery, scope: SearchScope.Full });
    }
  }, [scopingQuestions, scopingAnswers]);

  useEffect(() => {
    switch (searchQuery.scope) {
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
  }, [searchQuery]);

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
    if (searchQuery) {
      navigate({
        pathname: 'search',
        search: createSearchParams({
          q: searchQuery.query,
          scope: searchQuery.scope,
        }).toString(),
      });
    }
  };

  const handleChange = (e: any) => {
    const value = e.target.value;
    setSearchQuery({
      query: value,
      scope: searchQuery.scope,
    });
  };

  return (
    <div
      className={
        mobile ? 'search-bar hide-on-desktop' : 'search-bar hide-on-mobile'
      }
      style={{ width: searchBarFocus ? '100%' : '' }}
    >
      <Stack spacing={0}>
        <TextField
          focused={searchBarFocus}
          inputRef={inputRef}
          placeholder={placeholder}
          value={searchQuery.query}
          autoComplete={'off'}
          spellCheck={false}
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
                {searchQuery.query ? (
                  <Tooltip title={'Clear'} placement={'bottom'} arrow>
                    <IconButton
                      disableRipple
                      onClick={() => {
                        setSearchQuery({ ...searchQuery, query: '' });
                      }}
                      style={{
                        color: searchQuery ? styles.color_primary_500 : '',
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </InputAdornment>
            ),
          }}
        />
        <div className={'search-scope-container'} ref={containerRef}>
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
                      setScopingQuestions(!scopingQuestions);
                      if (inputRef.current) {
                        inputRef.current.unbind('blur');
                      }
                    }}
                    icon={
                      scopingQuestions ? (
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
                      color: scopingQuestions ? 'white' : '',
                      backgroundColor: scopingQuestions
                        ? styles.color_primary_500
                        : '',
                      borderColor: scopingQuestions
                        ? styles.color_primary_500
                        : '',
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
                      setScopingAnswers(!scopingAnswers);
                      if (inputRef.current) {
                        inputRef.current.focus();
                      }
                    }}
                    icon={
                      scopingAnswers ? (
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
                      color: scopingAnswers ? 'white' : styles.color_text,
                      backgroundColor: scopingAnswers
                        ? styles.color_primary_500
                        : '',
                      borderColor: scopingAnswers
                        ? styles.color_primary_500
                        : '',
                    }}
                  />
                </div>
              </Stack>
            </div>
          </Slide>
        </div>
      </Stack>
    </div>
  );
}
